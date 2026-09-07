#!/usr/bin/env python3
"""Inject shared header/footer partials into each HTML page."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE, 'partials', 'header.html'), 'r', encoding='utf-8') as f:
    HEADER = f.read().strip()
with open(os.path.join(BASE, 'partials', 'footer.html'), 'r', encoding='utf-8') as f:
    FOOTER = f.read().strip()

pages = ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html']

for page in pages:
    path = os.path.join(BASE, page)
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if '__HEADER__' in content:
        content = content.replace('<!-- __HEADER__ -->', HEADER)
    if '__FOOTER__' in content:
        content = content.replace('<!-- __FOOTER__ -->', FOOTER)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Built', page)
print('Done.')
