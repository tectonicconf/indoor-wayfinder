# Project notes

This is the Tectonic 2026 conference venue map, forked from KnotzerIO/indoor-wayfinder ("Pathpal"). See README.md for the upstream app's own docs.

## Design requirement: mobile-first

The map UI **must be designed and optimized for phone-sized viewports first**. Most attendees will use this on their phones during the event, not on desktop. This is a hard requirement, not a nice-to-have:

- Layout, touch targets, zoom/pan behavior, the floor/venue switcher, and route-detail panels all need to work well on a narrow phone screen before desktop polish.
- Test and screenshot changes at phone viewport width, not just desktop, before considering a UI change done.
- When in doubt between a desktop-optimized layout and a phone-optimized one, choose the phone-optimized one.
