# TODO:

### HEADER:
- [x] ~~change header text colour when background becomes dark~~ gave 75% opacity bg instead
- [x] make background lighter when in dark mode

### STICKY-SECTION:
- [x] refactor it to use {...children}, make it easier to use
- [ ] get shadows working

### SCROLL:
- [ ] check out smooth scrolling and scroll snap to sections
- [ ] scroll to top button
- [ ] make scroll down indicator clickable
- [ ] change shake velocity to match scroll speed to top.

### MATTER-JS:
- [ ] change initialBodies (currently they just drop, could make them pour in from sides or something)
- [ ] vectorise hero text (svg static bodies in matter.js world)
- [ ] bullet time (slow mo) on shake
  - [matter-js demo](https://brm.io/matter-js/demo/#timescale)
- [ ] change initialBodiesCount based on width 
- [ ] why does simulation reinitialise when changing debug?

### OTHER:
- [x] make `animated-link-button` scroll on hover effect nicer (out bottom, and in from top)
- [ ] change shape colours and colourful-text colours to match (decide colour palette -> also change section colours)

### RANDOM IDEAS:
- [ ] drag shapes through different sections (colour mask between sections)
- [ ] make login/signup windows pop up/scroll within the matter-js canvas
- [ ] maybe still need a section navigation (i.e. about, mission, our team, contact, etc.)
  - [x] [awwwards side menu](https://www.youtube.com/watch?v=MsdR8iAscNs)