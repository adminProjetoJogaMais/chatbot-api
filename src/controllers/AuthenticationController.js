const { compare } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const availableUsers = ['Datax Dev', 'Hyperflow Dev'];

        const user = await Usuario.findOne({
            where: { nome: username },
        });

        if (!user || !await compare(password, user.senha) || !availableUsers.includes(user.nome)) return res.status(401).json({
            status: 'failed',
            message: 'authentication failed'
        });

        const accessToken = sign({ name: user.nome }, process.env.SECRET, { expiresIn: '1d' });
        res.json({ accessToken });
    } catch (e) {
        return res.status(401).json({
            status: 'failed',
            message: 'authentication failed'
        });
    }
}

exports.authenticate = async (req, res, next) => {
    if (req.url === '/api/login') return next();

    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({
            status: 'failed',
            message: 'authentication failed'
        });

        verify(token, process.env.SECRET, (err, user) => {
            if (err) return res.status(401).json({
                status: 'failed',
                message: 'authentication failed'
            });

            next();
        })
    } catch (e) {
        return res.status(401).json({
            status: 'failed',
            message: 'authentication failed'
        });
    }
}