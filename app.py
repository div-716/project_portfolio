from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Ensure the data directory exists
os.makedirs('data', exist_ok=True)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/contact', methods=['POST'])
def contact():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('name') or not data.get('email') or not data.get('message'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create contact entry
        contact_entry = {
            'name': data['name'],
            'email': data['email'],
            'message': data['message'],
            'timestamp': datetime.now().isoformat(),
            'ip_address': request.remote_addr
        }
        
        # Load existing messages
        messages_file = 'data/messages.json'
        messages = []
        
        if os.path.exists(messages_file):
            try:
                with open(messages_file, 'r') as f:
                    messages = json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                messages = []
        
        # Add new message
        messages.append(contact_entry)
        
        # Save messages
        with open(messages_file, 'w') as f:
            json.dump(messages, f, indent=2)
        
        # Also save to a text file for easy reading
        with open('data/messages.txt', 'a') as f:
            f.write(f"\n--- New Message ({contact_entry['timestamp']}) ---\n")
            f.write(f"Name: {contact_entry['name']}\n")
            f.write(f"Email: {contact_entry['email']}\n")
            f.write(f"Message: {contact_entry['message']}\n")
            f.write(f"IP: {contact_entry['ip_address']}\n")
            f.write("-" * 50 + "\n")
        
        return jsonify({'message': 'Message sent successfully!'}), 200
        
    except Exception as e:
        print(f"Error processing contact form: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/messages', methods=['GET'])
def get_messages():
    """Admin endpoint to view all messages"""
    try:
        messages_file = 'data/messages.json'
        
        if os.path.exists(messages_file):
            with open(messages_file, 'r') as f:
                messages = json.load(f)
            return jsonify(messages), 200
        else:
            return jsonify([]), 200
            
    except Exception as e:
        print(f"Error retrieving messages: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)