const db = require('../models');
const Content = db.content;

const saveContent = async (req, res) => {
    const { content } = req.body;
    console.log('Received content to save:', content);

    try {
        await Content.upsert({
            key: 'mainContent', // You can change this key as needed
            value: content
        });

        res.status(200).json({ message: 'Content saved successfully' });
    } catch (error) {
        console.error('Error saving content:', error);
        res.status(500).json({ message: 'Failed to save content' });
    }
};

const getContent = async (req, res) => {
    console.log('Fetching content');

    try {
        const content = await Content.findOne({ where: { key: 'mainContent' } });

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        res.status(200).json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ message: 'Failed to fetch content' });
    }
};

module.exports = { saveContent, getContent };