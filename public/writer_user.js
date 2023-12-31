// writer_user.js



function createEditButton(postId) {
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => {
    const newTitle = prompt('Enter new title:');
    const newContent = prompt('Enter new content:');
    if (newTitle !== null && newTitle.trim() !== '' && newContent !== null && newContent.trim() !== '') {
      editPost(postId, newTitle, newContent);
    }
  });
  return editButton;
}




// Function to edit a post
function editPost(postId, newTitle, newContent) {
  fetch(`/update_post/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ newTitle, newContent })
  })
    .then(response => {
      if (response.ok) {
        fetchPosts(); // Fetch posts again to update the list after editing
      } else {
        console.error('Failed to edit the post!');
      }
    })
    .catch(error => {
      console.error('Error editing post:', error);
    });
}

// ... (your existing code remains the same)

// Inside the forEach loop where you create the list item for each post



 // Function to create tag button
function createTagButton(postId) {
  const tagButton = document.createElement('button');
  tagButton.textContent = 'Tag';
  tagButton.addEventListener('click', () => {
    const tagName = prompt('Enter tag name:');
    if (tagName !== null && tagName.trim() !== '') {
      tagPost(postId, tagName);
    }
  });
  return tagButton;
}



// / Function to tag a post
function tagPost(postId, tagName) {
  fetch(`/writer_user/tag/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tagName })
  })
    .then(response => {
      if (response.ok) {
        fetchPosts(); // Fetch posts again to update the list after tagging
      } else {
        console.error('Failed to tag the post!');
      }
    })
    .catch(error => {
      console.error('Error tagging post:', error);
    });
}




  //
// Function to create delete button
function createDeleteButton(postId) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deletePost(postId);
    });
    return deleteButton;
  }



 
  
  // Function to delete a post
  function deletePost(postId) {
    fetch(`/writer_user/${postId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          fetchPosts(); // Fetch posts again to update the list after deletion
        } else {
          console.error('Failed to delete the post!');
        }
      })
      .catch(error => {
        console.error('Error deleting post:', error);
      });
  }
  

// Function to fetch posts from the server
function fetchPosts() {
  fetch('/writer_user')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const posts = data.posts;
      const postsList = document.getElementById('posts');
      postsList.innerHTML = ''; // Clear previous posts

      // Inside the forEach loop where you create the list item for each post
posts.forEach(async post => {
  const listItem = document.createElement('li');
  const postContainer = document.createElement('div');
  postContainer.style.border = '1px solid black'; // Border around the post container
  postContainer.style.padding = '10px'; // Padding for space inside the container
  postContainer.style.marginBottom = '10px'; // Margin to create space between posts

  // Create elements for post title, content, category, and name
  const titleElement = document.createElement('h2');
  titleElement.textContent = post.post_title;
  titleElement.style.color = 'red'; // Red color for title

  const contentElement = document.createElement('p');
  contentElement.textContent = post.content;
  contentElement.style.color = 'green'; // Green color for content

  const categoryElement = document.createElement('p');
  categoryElement.textContent = `Category: (${post.name})`;

  const nameElement = document.createElement('span');

  // Append elements to post container
  postContainer.appendChild(titleElement);
  postContainer.appendChild(contentElement);
  postContainer.appendChild(categoryElement);
  postContainer.appendChild(nameElement);

  const editButton = createEditButton(post.post_id);
  postContainer.appendChild(editButton);
  const deleteButton = createDeleteButton(post.post_id);
  const tagButton = createTagButton(post.post_id);

  postContainer.appendChild(tagButton);
  postContainer.appendChild(deleteButton);

  // Fetch and display tags for each post
  const tags = await fetchTagsForPost(post.post_id);
  const tagsDiv = document.createElement('div');
  tagsDiv.textContent = `Tags: ${tags.map(tag => `#${tag.name}`).join(', ')}`; // Extract tag names and join with comma
  postContainer.appendChild(tagsDiv);

  listItem.appendChild(postContainer);
  postsList.appendChild(listItem);
});

    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error.message);
    });
}

// Function to fetch tags for a specific post from the server
function fetchTagsForPost(postId) {
  return fetch(`/writer_user/tags/${postId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => data.tags)
    .catch(error => {
      console.error('Error fetching tags:', error.message);
      return [];
    });
}



  
  // Call fetchPosts function when the page loads
  window.onload = function () {
    fetchPosts();
  };
  