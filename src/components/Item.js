import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Item.css';

function Item() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    itemDescription: '',
    image: null,
    imagePreview: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.price || !formData.itemDescription) {
      alert('Please fill in all fields');
      return;
    }

    // Create new item object
    const newItem = {
      id: Date.now(),
      itemName: formData.itemName,
      price: parseFloat(formData.price),
      itemDescription: formData.itemDescription,
      image: formData.imagePreview,
      rating: 5,
    };

    // Get existing items from localStorage
    const existingItems = JSON.parse(localStorage.getItem('customItems')) || [];
    existingItems.push(newItem);
    localStorage.setItem('customItems', JSON.stringify(existingItems));

    // Reset form and navigate back
    setFormData({
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
              value={formData.itemName}
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
              value={formData.price}
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
              value={formData.itemDescription}
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

          {formData.imagePreview && (
            <div className="image-preview">
              <img src={formData.imagePreview} alt="Preview" />
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