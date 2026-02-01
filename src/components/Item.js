import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Item.css';

function Item() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    itemName: '',
    price: '',
    itemDescription: '',
    image: null,
    imagePreview: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!data.itemName || !data.price || !data.itemDescription) {
      alert('Please fill in all fields');
      return;
    }

  const formData = new FormData();
  formData.append('itemName', data.itemName);
  formData.append('amount', data.price);
  formData.append('description', data.itemDescription);
  formData.append('itemImage', data.image);

    try{
    const response = await axios.post('http://localhost:8080/api/create-item', formData, {
      headers: {
        
      }
    });
    if(response.ok){
      const data = await response.json();
      console.log('Create Item successfully:', data);
    }
  }catch(error){  
    console.error('Error during creating item:', error);
  }


    // Create new item object
    const newItem = {
      id: Date.now(),
      itemName: data.itemName,
      price: parseFloat(data.price),
      itemDescription: data.itemDescription,
      image: data.imagePreview,
      rating: 5,
    };

    // Get existing items from localStorage
    const existingItems = JSON.parse(localStorage.getItem('customItems')) || [];
    existingItems.push(newItem);
    localStorage.setItem('customItems', JSON.stringify(existingItems));

    // Reset form and navigate back
    setData({
      itemName: '',
      price: '',
      itemDescription: '',
      image: null,
      imagePreview: null,
    });

    alert('Item added successfully!');
    navigate('/home');
  };

  const handleCancel = () => {
    navigate('/home');
  };

  return (
    <div className="item-container">
      <div className="item-form-wrapper">
        <h2>Add New Item</h2>
        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-group">
            <label htmlFor="itemName">Item Name:</label>
            <input
              id="itemName"
              type="text"
              name="itemName"
              value={data.itemName}
              onChange={handleInputChange}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              id="price"
              type="number"
              name="price"
              value={data.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="itemDescription">Description:</label>
            <textarea
              id="itemDescription"
              name="itemDescription"
              value={data.itemDescription}
              onChange={handleInputChange}
              placeholder="Enter item description"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Image:</label>
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          {data.imagePreview && (
            <div className="image-preview">
              <img src={data.imagePreview} alt="Preview" />
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" className="btn-submit">Add Item</button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Item;