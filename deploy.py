#!/usr/bin/env python3
"""Prepare a clean, deploy-ready build of the site into ./dist.

Usage:
    python3 deploy.py

Outputs a folder ./dist containing only the public files needed to host the
site (HTML, CSS, JS, images). Everything else (build scripts, source partials,
internal files, the lead tracker) is intentionally left out.

You can then drag-and-drop the dist folder's contents into Netlify.
"""
import os
import shutil
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(BASE, 'dist')

WEB_PAGES = ['index.html', 'about.html', 'services.html', 'portfolio.html', 'contact.html', 'journal.html', 'journal-awadhi-menu-ideas.html', 'journal-catering-cost-lucknow.html']
STATIC_DIRS = ['assets', 'js']
ROOT_FILES = ['sitemap.xml', 'robots.txt']

# Files that must never be published, even though they sit at the project root.
EXCLUDE = {
    'build.py', 'deploy.py',
    'FM_Leads_Tracker.xlsx',
    'apps_script', 'partials',
}


def main():
    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)

    # 1) Build shared header/footer into pages if placeholders remain.
    header = footer = ''
    hpath = os.path.join(BASE, 'partials', 'header.html')
    fpath = os.path.join(BASE, 'partials', 'footer.html')
    if os.path.exists(hpath):
        with open(hpath, 'r', encoding='utf-8') as f:
            header = f.read().strip()
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            footer = f.read().strip()

    for page in WEB_PAGES:
        src = os.path.join(BASE, page)
        if not os.path.exists(src):
            print('  SKIP (missing):', page)
            continue
        with open(src, 'r', encoding='utf-8') as f:
            content = f.read()
        if header and '<!-- __HEADER__ -->' in content:
            content = content.replace('<!-- __HEADER__ -->', header)
        if footer and '<!-- __FOOTER__ -->' in content:
            content = content.replace('<!-- __FOOTER__ -->', footer)
        with open(os.path.join(DIST, page), 'w', encoding='utf-8') as f:
            f.write(content)
        print('  page:', page)

    # 2) Copy static directories (assets, js) wholesale.
    for d in STATIC_DIRS:
        src = os.path.join(BASE, d)
        if os.path.isdir(src):
            shutil.copytree(src, os.path.join(DIST, d))
            print('  static:', d)

    # 3) Copy a netlify.toml if present (redirects / headers).
    toml = os.path.join(BASE, 'netlify.toml')
    if os.path.exists(toml):
        shutil.copy2(toml, os.path.join(DIST, 'netlify.toml'))
        print('  config: netlify.toml')

    # 4) Copy root files required for SEO (sitemap, robots.txt).
    for f in ROOT_FILES:
        src = os.path.join(BASE, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(DIST, f))
            print('  root:', f)

    print('\nDeploy-ready build written to:', DIST)
    print('Drag the CONTENTS of', DIST, 'into Netlify (or set it as your publish dir).')


if __name__ == '__main__':
    main()
