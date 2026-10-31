# Vestacore Music: convenience targets.
# Provenance: created 2026-10-30T11:51:52+02:00 by Claude Fable 5.1 (claude-fable-5-1, Anthropic).
# Steward: Leonid (brief, review). Model: implementation. Licence CC BY 4.0.
# Revision 2026-10-30T12:16:00+02:00 by Claude Fable 5.1 (claude-fable-5-1): added techno and serve-techno for session 002.
#   Steward: brief for the session. Model: implementation.

PY ?= python3
PORT ?= 8765

.PHONY: help tone chord series web serve techno serve-techno check clean

help:
	@echo "make tone    render and play A2 with five harmonics at 1/n"
	@echo "make chord   render and play a just-intonation major triad over 110 Hz"
	@echo "make series  play the first eight harmonics of A1 (55 Hz) one after another"
	@echo "make web     open the Harmonic Playground in the default browser"
	@echo "make serve   serve the Harmonic Playground at http://localhost:$(PORT)"
	@echo "make techno        open the Techno UI demo (session 002) in the default browser"
	@echo "make serve-techno  serve the Techno UI demo at http://localhost:8766"
	@echo "make check   syntax-check the tools"
	@echo "make clean   remove rendered audio in out/"

tone:
	$(PY) tools/macos/render.py --notes A2 --partials 1,0.5,0.33,0.25,0.2 --seconds 3 --play

chord:
	$(PY) tools/macos/render.py --f0 110 --ratios 1,5/4,3/2 --partials 1,0.5,0.25 --seconds 5 --play

series:
	@for k in 1 2 3 4 5 6 7 8; do \
	    $(PY) tools/macos/render.py --f0 55 --ratios $$k --partials 1 --seconds 1.5 --attack 0.05 --release 0.4 --out out/series-$$k.wav --quiet --play; \
	done

web:
	open tools/browser/index.html

serve:
	$(PY) -m http.server $(PORT) --directory tools/browser

techno:
	open session-techno-ui/shader/index.html

serve-techno:
	$(PY) -m http.server 8766 --directory session-techno-ui/shader

check:
	$(PY) -m py_compile tools/macos/render.py
	node --check tools/browser/playground.js
	node --check session-techno-ui/shader/techno.js
	@echo "ok"

clean:
	rm -rf out/
