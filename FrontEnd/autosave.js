document.addEventListener('DOMContentLoaded', function() {
    const editableContent = document.getElementById('editable-content');

    // Fetch existing content on page load
    const fetchContent = async () => {
        try {
            const response = await fetch('http://localhost:5678/api/content', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (response.ok) {
                editableContent.innerHTML = data.value;
            } else {
                console.error('Failed to fetch content:', data.message);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    fetchContent();

    // Autosave function
    const autosave = async () => {
        const content = editableContent.innerHTML;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5678/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('Failed to save content');
            }

            const data = await response.json();
            console.log('Content saved:', data);
        } catch (error) {
            console.error('Error saving content:', error);
        }
    };

    // Debounce function to limit the rate at which the autosave function is called
    const debounce = (func, delay) => {
        let debounceTimer;
        return function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
        };
    };

    // Attach autosave function to content change event with debounce
    editableContent.addEventListener('input', debounce(autosave, 1000));
});