# UI and accessibility

## Coverage target

Inspect light, dark and system themes; landing and assessment layouts at 1280x720, 768x900, 390x844 and 320x640;
hover, focus, disabled and pressed states; modal semantics and dismissal; keyboard navigation; headings and landmarks;
choice labels; status badges; sticky navigation and scroll restoration; contrast, overflow and touch targets.

## Investigation state

- Status: passed for exercised surfaces, with browser coverage limits
- Tested or inspected: Chrome DOM snapshots and computed styles for landing, practice, review, result, theme controls,
  development scenario controls, focus restoration, modal Escape and backdrop dismissal, keyboard selection, and sticky
  navigation. Responsive checks covered 390x844 and 320x640, with source and CSS inspection for 768x900 and 1280x720.
- Evidence: no horizontal overflow was found at 390 or 320 widths; mobile theme controls computed as `position: static`;
  the Paper CTA hover text contrast measured 13.40:1 in dark mode and 10.37:1 in light mode; question navigation focused
  the new heading below the 73px sticky navigation at an observed 87.8px top offset; modal cancel focus and restoration
  worked as specified.
- Confirmed findings: none in the exercised UI. Interactive browser automation was unavailable until the user opened the
  browser, and no screenshot-based visual review was possible before that connection. Extension-origin MetaMask warnings
  were present in browser logs, but no application-origin errors were observed.
- Unresolved questions: exact pixel review at 768x900 and 1280x720, and assistive-technology output beyond the DOM
  accessibility tree, remain unvalidated in this session.
- Remediation and verification: no UI remediation task created from this pass.
