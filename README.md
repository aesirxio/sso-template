# AesirX template
AesirX template with Webpack 5 for Joomla projects

## How it works

This is a Webpack template that detects the structure (given a base) and automates actions to:

* Copy the template files to the website
* Clean the website
* Detect active changes on your template repo and copy to your website on save
* Create release zip packages of your template

## Multi Entry points

`entry/app.js` is main entry. It is loaded all pages.

Add new entry to `entry` folder with:

Joomla views

`option/view/layout.js`

Modules

`modules/mod_x.position.js`

Template will load the right entry to right page.

## tl;dr

```
git clone
npm install
```

Copy sample.env to .env, and edit to match your configuration

## Tasks

To build the template:

`npm run build`

To watch the template:

`npm run watch`

To release the template:

`npm run release`
