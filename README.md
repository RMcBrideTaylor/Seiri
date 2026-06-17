# Seiri
-----
![Screenshot of the app interface](resources/screenshot.png)

In the process of learning art, I've often found myself in situations where I need to curate collections of references images. Existing services all either demand you hand over data, lack features I want, or are constantly being flooded withAI photos, so I thought I'd go ahead and make my own.

Enter Seiri. The objective is to create an application that lets me use the existing data storage that I've already paid for and have thousands of images stored in without having to pay for a separate service.

The app creates a library at the root folder and indexes your images, allowing you to search through them, tag them, and attach them to sub-collections called 'Projects'

I started with Electron because it's an easy jumping off point to quickly get something that runs on Windows/Linux/Mac, but at some point I intend to do native versions as well as a mobile edition if interest is shown.

**Some wishlist items of things I intend to do soon:**
- [ ] JPEG, PNG, GIF support
- [ ] Grid resizing in the main feed
- [ ] The ability to filter photos by containing folder
- [ ] Image tagging and search
- [ ] Light mode / theming 
- [ ] Re-write in a more event-based manner to intelligently trigger re-indexing when needed 
- [ ] Pull in metadata from images if available


**Some things that I think are further out and not for an initial release:**
- [ ] Native apps
- [ ] HEIC support
- [ ] Basic ML image classifier to identify subjects in a photo
- [ ] Video support / frame by frame playback (useful for studying animation)
 
 
-----
# Developer Notes

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project Setup

### Install

```bash
$ yarn
```

### Development

```bash
$ yarn dev
```

### Build

```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```
