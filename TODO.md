# application viewer

### general
- make responsive to parent size (i.e. resizable panel) (cannot just do `hidden sm:block`)
- allow shadows to overflow (currently they are being cutoff at the bottom)

### application tab
- make toasts clickable when dialog open
  - make sure clicking on toast does not close the dialog
- if user comment is not empty, prevent user from closing dialog until acknowledge unsaved changes
- skeletons on load (if do this, maybe don't even need toasts -> since user gets feedback from switching already)
- do we even need distinction between general and port-specific questions?

### profile tab
- redesign -> maybe just combine it with review tab

### review tab
- show director comments (same as ones in application tab)
- average score
- flags
- application status to other portfolios
- final decision for interview