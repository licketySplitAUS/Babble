param(
  [string]$SourceCsv = (Join-Path $PSScriptRoot '..\..\GitHubSelfServe\SelfServeClues\public\BabbleWordList.csv')
)

$ErrorActionPreference = 'Stop'
$lengths = 4..12
$words = Import-Csv -LiteralPath $SourceCsv | ForEach-Object { $_.word.Trim().ToLowerInvariant() }
$head = @'
<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><style>
html{scrollbar-width:none}html::-webkit-scrollbar{display:none}body{margin:0;font:16px/1 ui-monospace,Consolas,"Liberation Mono",monospace;overflow-x:hidden}.find{position:fixed;z-index:2;inset:0 0 auto;height:26px;margin:0;border:0;border-bottom:1px solid #777;border-radius:0;box-sizing:border-box;padding:2px 4px;font:15px ui-monospace,Consolas,"Liberation Mono",monospace;background:#fff}.words{padding-top:26px}.w{height:16px;cursor:pointer;white-space:nowrap}.w:hover,.found{background:#fff0a8}.copied{background:#b9f6ca}
</style><body><input class="find" aria-label="Find a word" placeholder="Type a word" autocomplete="off" spellcheck="false"><div class="words">
'@
$tail = @'
</div><script>
const input=document.querySelector(".find"),words=[...document.querySelectorAll(".w")];let marked=null,speed=0,previous=performance.now();
function mark(word,kind="found",move=true){if(marked)marked.classList.remove("found","copied");marked=word;if(word){word.classList.add(kind);if(move)word.scrollIntoView({block:"center"})}}
input.addEventListener("input",()=>{const value=input.value.trim().toLowerCase();if(!value)return mark(null);mark(words.find(w=>w.textContent===value)||words.find(w=>w.textContent.startsWith(value))||null)});
input.addEventListener("keydown",event=>{if(event.key==="Enter"&&marked){event.preventDefault();marked.click()}});
document.querySelector(".words").addEventListener("click",event=>{const word=event.target.closest(".w");if(!word)return;const selection=getSelection(),range=document.createRange();range.selectNodeContents(word);selection.removeAllRanges();selection.addRange(range);let copied=false;try{copied=document.execCommand("copy")}catch{}if(!copied&&navigator.clipboard)navigator.clipboard.writeText(word.textContent).catch(()=>{});mark(word,"copied",false);setTimeout(()=>word.classList.remove("copied"),500);location.hash=new URLSearchParams({submit:word.textContent,nonce:Date.now()}).toString()});
document.addEventListener("mousemove",event=>{if(event.target===input)return speed=0;const top=26,zone=(innerHeight-top)*.375,bottom=innerHeight-zone;if(event.clientY<top+zone)speed=-1100*Math.pow(1-(event.clientY-top)/zone,1.5);else if(event.clientY>bottom)speed=1100*Math.pow((event.clientY-bottom)/zone,1.5);else speed=0});
document.addEventListener("mouseleave",()=>speed=0);function glide(now){const elapsed=Math.min(now-previous,50)/1000;previous=now;if(speed)scrollBy(0,speed*elapsed);requestAnimationFrame(glide)}requestAnimationFrame(glide);
</script>
'@

foreach ($length in $lengths) {
  $list = $words | Where-Object { $_.Length -eq $length }
  $lines = $list | ForEach-Object { '<div class="w">' + [Net.WebUtility]::HtmlEncode($_) + '</div>' }
  $output = $head + ($lines -join "`n") + $tail
  [IO.File]::WriteAllText((Join-Path $PSScriptRoot "words-$length.html"), $output, [Text.UTF8Encoding]::new($false))
  Write-Host "words-$length.html: $($list.Count) words"
}
