import re

with open('services/registrationApi.ts', 'r', encoding='utf-8') as f:
    content = f.read()

old_vars = '''// Default EmailJS credentials - in a real app these would be in .env
// We'll use a placeholder/mock implementation that succeeds if they aren't configured
const EMAILJS_SERVICE_ID = importMeta.env?.VITE_EMAILJS_SERVICE_ID || 'default_service';
const EMAILJS_TEMPLATE_ID = importMeta.env?.VITE_EMAILJS_TEMPLATE_ID || 'default_template';
const EMAILJS_PUBLIC_KEY = importMeta.env?.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key';'''

new_vars = '''// Ensure EmailJS credentials exist in your .env file
const EMAILJS_SERVICE_ID = importMeta.env?.VITE_EMAILJS_SERVICE_ID || 'default_service';
const EMAILJS_TEMPLATE_ID = importMeta.env?.VITE_EMAILJS_TEMPLATE_ID || 'default_template';
const EMAILJS_PUBLIC_KEY = importMeta.env?.VITE_EMAILJS_PUBLIC_KEY || 'default_public_key';'''

content = content.replace(old_vars, new_vars)

with open('services/registrationApi.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("API Patch applied")
