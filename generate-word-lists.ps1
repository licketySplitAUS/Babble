param(
  [string]$SourceCsv = (Join-Path $PSScriptRoot '..\..\GitHubSelfServe\SelfServeClues\public\BabbleWordList.csv')
)

$ErrorActionPreference = 'Stop'
$lengths = 4..12
$words = Import-Csv -LiteralPath $SourceCsv | ForEach-Object { $_.word.Trim().ToLowerInvariant() }
$head = @'
<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>
html{scrollbar-width:none}html::-webkit-scrollbar{display:none}body{margin:0;font:16px/1 ui-monospace,Consolas,"Liberation Mono",monospace;overflow-x:hidden}.find{position:fixed;z-index:2;inset:0 0 auto;height:26px;margin:0;border:0;border-bottom:1px solid #777;border-radius:0;box-sizing:border-box;padding:2px 4px;font:15px ui-monospace,Consolas,"Liberation Mono",monospace;background:#fff}.words{padding-top:26px}.w{position:relative;height:16px;cursor:pointer;white-space:nowrap;transform-origin:left center}.w.used{color:#27313a;background:linear-gradient(90deg,#edf2f7 0 72%,transparent)}.w:hover,.found{background:#fff0a8}.w.burst{z-index:1;color:var(--fg);background:var(--bg);outline:2px solid var(--edge);outline-offset:-2px;animation:word-pop .78s cubic-bezier(.2,.9,.25,1)}.v0{--bg:#ffe066;--fg:#1b1b1b;--edge:#8a6100}.v1{--bg:#b7f7c4;--fg:#102a17;--edge:#187532;outline-style:dashed}.v2{--bg:#bde0fe;--fg:#10263d;--edge:#1769aa;outline-style:double;outline-width:3px}.v3{--bg:#e5c3ff;--fg:#2b1240;--edge:#7b2cbf;border-radius:7px;box-shadow:0 0 7px #7b2cbf}.v4{--bg:#ffc8dd;--fg:#3c1020;--edge:#b4235a;outline:0;box-shadow:inset 4px 0 #b4235a,inset -4px 0 #b4235a}.v5{--bg:#ffd6a5;--fg:#3d2100;--edge:#b85c00;background:linear-gradient(90deg,#ffd6a5,#fff1d8,#ffd6a5)}.v6{--bg:#a8edea;--fg:#103535;--edge:#087f79;outline:0;box-shadow:inset 0 -3px #087f79}.v7{--bg:#ffadad;--fg:#421515;--edge:#a92929;border-radius:999px;box-shadow:inset 0 0 0 2px #fff}.v8{--bg:#263859;--fg:#fff;--edge:#79b8ff;box-shadow:0 0 0 1px #263859,0 0 6px #79b8ff}.v9{--bg:#d9f99d;--fg:#25330a;--edge:#56820f;outline-style:dotted;box-shadow:inset 0 0 0 1px #fff}@keyframes word-pop{0%{transform:scale(1)}32%{transform:translateX(2px) scale(1.12)}58%{transform:scale(1.035)}100%{transform:scale(1)}}
</style><body><input class="find" aria-label="Find a word" placeholder="Type a word" autocomplete="off" spellcheck="false"><div class="words">
'@
$tail = @'
</div><script>
const input=document.querySelector(".find"),words=[...document.querySelectorAll(".w")],variants=Array.from({length:10},(_,i)=>"v"+i);let marked=null,speed=0,previous=performance.now();
function mark(word){if(marked)marked.classList.remove("found");marked=word;if(word){word.classList.add("found");word.scrollIntoView({block:"center"})}}
input.addEventListener("input",()=>{const value=input.value.trim().toLowerCase();if(!value)return mark(null);mark(words.find(w=>w.textContent===value)||words.find(w=>w.textContent.startsWith(value))||null)});
input.addEventListener("keydown",event=>{if(event.key==="Enter"&&marked){event.preventDefault();marked.click()}});
document.querySelector(".words").addEventListener("click",event=>{const word=event.target.closest(".w");if(!word)return;const selection=getSelection(),range=document.createRange();range.selectNodeContents(word);selection.removeAllRanges();selection.addRange(range);let copied=false;try{copied=document.execCommand("copy")}catch{}if(!copied&&navigator.clipboard)navigator.clipboard.writeText(word.textContent).catch(()=>{});selection.removeAllRanges();if(marked)marked.classList.remove("found");marked=null;clearTimeout(word._burstTimer);word.classList.remove("burst",...variants);void word.offsetWidth;word.classList.add("used","burst",variants[Math.floor(Math.random()*variants.length)]);word._burstTimer=setTimeout(()=>word.classList.remove("burst",...variants),1000);location.hash=new URLSearchParams({submit:word.textContent,nonce:Date.now()}).toString()});
document.addEventListener("mousemove",event=>{if(event.target===input)return speed=0;const top=26,zone=(innerHeight-top)*.375,bottom=innerHeight-zone;if(event.clientY<top+zone)speed=-1100*Math.pow(1-(event.clientY-top)/zone,1.5);else if(event.clientY>bottom)speed=1100*Math.pow((event.clientY-bottom)/zone,1.5);else speed=0});
document.addEventListener("mouseleave",()=>speed=0);function glide(now){const elapsed=Math.min(now-previous,50)/1000;previous=now;if(speed)scrollBy(0,speed*elapsed);requestAnimationFrame(glide)}requestAnimationFrame(glide);
</script>
'@

foreach ($length in $lengths) {
  $list = $words | Where-Object { $_.Length -eq $length } | Sort-Object
  $lines = $list | ForEach-Object { '<div class="w">' + [Net.WebUtility]::HtmlEncode($_) + '</div>' }
  $output = $head + ($lines -join "`n") + $tail
  [IO.File]::WriteAllText((Join-Path $PSScriptRoot "words-$length.html"), $output, [Text.UTF8Encoding]::new($false))
  Write-Host "words-$length.html: $($list.Count) words"
}
