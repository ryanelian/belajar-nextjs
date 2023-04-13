export default function handler(req, res) {
    res.status(200).json([{
        name: 'Kurt'
    }, {
        name: 'Alicia'
    }, {
        name: 'Felicia'
    },])
}