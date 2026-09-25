## ADDED Requirements

### Requirement: Chrome Issue Visual System
The site SHALL use a light plaster ground, ink text, a modern grotesk display face for headings, chrome only in the homepage balloon stars, and quiet fade-and-settle motion without animated type width, with dark "night" surfaces reserved for the homepage work section and the cover window.

#### Scenario: Any page renders
- **WHEN** any page renders
- **THEN** body text SHALL use the body face and headings SHALL use the display face
- **AND** text SHALL keep readable contrast against its surface.

### Requirement: Painted Garden Cover
The homepage cover SHALL show an arched window onto a painted night garden that reads as a real view with depth.

#### Scenario: Cover renders with motion allowed
- **WHEN** the homepage loads and the viewer allows motion
- **THEN** the garden SHALL render in layers (sky, distance, lawn, mid-ground, foreground) that shift at different rates with the pointer and sway gently
- **AND** painting SHALL pause while the window is off screen.

#### Scenario: Viewer prefers reduced motion
- **WHEN** the viewer prefers reduced motion
- **THEN** the garden SHALL render as a single still frame and the chrome stars SHALL not rotate.

### Requirement: Restrained Copy
Public copy SHALL state only what is true and needed.

#### Scenario: Copy is reviewed
- **WHEN** homepage copy is reviewed
- **THEN** it SHALL NOT contain datelines, issue numbers, invented quotes, fake interview framing or other decorative text
- **AND** each featured project SHALL have one plain subtitle and one label.
