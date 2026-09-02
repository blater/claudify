![Claudify](assets/Claudify.png)

### Paste English prose. Make it Linked-in share-ready.

Writing falling flat?  
* Too predictable? 
* Too polished
* Too **human**?

[Claudify](https://blater.github.io/claudify/) makes your words speak the language of AI.

With absolutely no AI use of its own, [Claudify](https://blater.github.io/claudify/) takes solid, well crafted English prose and combines advanced linguistic heuristics with raw power to bend, fold, crush, and extrude it oozing and sweaty into the familiar machine-engineered patterns and tics that mark the outpourings of Claude and other AI's.

Claudify stamps it with all of the comforting AI hallmarks readers have come to recognize and expect: lexical clichés, marketing clusters, em dashes, the rule of three, passive constructions, and clusters of transitions. 
Need an unexpectedly strange word choice or an awkward turn of phrase? [Claudify](https://blater.github.io/claudify/) is there to help.


## Usage

Either paste your text into the "Source Text" edit box, or click on Source URL and choose a document on the web to load (may have limitations), and then click "Claudify it"

You can also load one of the example texts and try that. In this one we clean up a passage from stuffy old Hamlet and make it relevant for modern audiences.
![Claudify](assets/operation1.png)

_Writing takes work_. But it shouldn’t feel like hard labor. Relax and sit back while Claudify enslopifies for *you*.


## Run locally

```sh
npm test
npm run check
npm run serve
```
Then open <http://localhost:8000>. The Python command is a development convenience only: any static host works, and no application server runs in production. Native ES modules do not work reliably from `file://` URLs.

URL loading is best-effort and browser-only. Recognized public GitHub issue and pull-request URLs use the disclosed `api.github.com` adapter. Other URLs are fetched directly and remain subject to CORS, authentication, paywalls, and bot controls.

(1) Claudify is 250% vibe coded. The author has never seen the source code, thus has no opinion on it. Exposure may be associated with ocular discomfort and mild nausea
