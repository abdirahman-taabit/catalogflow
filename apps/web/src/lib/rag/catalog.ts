export interface CatalogRow { row: number; sku: string; title: string; description: string; category: string; }
export const DEMO_CATALOG: CatalogRow[] = [
{row:2,sku:"KEY-2001",title:"Wireless mechanical keyboard",description:"Compact wireless keyboard with tactile switches and a rechargeable battery for home or office use.",category:"Computer accessories"},
{row:3,sku:"MSE-2002",title:"Ergonomic wireless mouse",description:"Comfortable wireless mouse with quiet buttons and adjustable tracking for daily productivity.",category:"Computer accessories"},
{row:4,sku:"MON-2003",title:"27 inch QHD monitor",description:"Crisp QHD display with an adjustable stand and USB-C connectivity for modern workspaces.",category:"Computer accessories"},
{row:5,sku:"HUB-2004",title:"Seven port USB-C hub",description:"Connect displays storage and power through one compact aluminium hub.",category:"Computer accessories"},
{row:6,sku:"STD-2005",title:"Aluminium laptop stand",description:"Stable laptop stand with adjustable height and a ventilated platform.",category:"Computer accessories"},
{row:7,sku:"CAM-2006",title:"COMPACT TRAVEL CAMERA",description:"12 MP camera.",category:"Photography"},
{row:8,sku:"TRI-2007",title:"Travel camera tripod",description:"Lightweight folding tripod with a stable ball head and quick-release plate.",category:"Photography"},
{row:9,sku:"LNS-2008",title:"Portrait camera lens",description:"Bright prime lens designed for clear portraits and soft background separation.",category:"Photography"},
{row:10,sku:"SPK-2009",title:"Portable room speaker",description:"Balanced sound splash resistance and twelve hours of playback in a compact enclosure.",category:"Audio"},
{row:11,sku:"AUD-2010",title:"Everyday active headphones",description:"Lightweight wireless headphones with 30-hour battery life and soft memory-foam cushions.",category:"Audio"},
{row:12,sku:"EAR-2011",title:"WIRED IN EAR HEADPHONES",description:"Simple wired earphones.",category:"Audio"},
{row:13,sku:"MIC-2012",title:"USB podcast microphone",description:"Cardioid USB microphone with a desktop stand and direct headphone monitoring.",category:"Audio"},
{row:14,sku:"BOT-2013",title:"Stainless steel bottle",description:"Double-wall insulated bottle that keeps drinks cold for 24 hours.",category:"Kitchen and dining"},
{row:15,sku:"MUG-2014",title:"Ceramic travel mug",description:"Leak-resistant ceramic mug with a silicone sleeve and reusable lid.",category:"Kitchen and dining"},
{row:16,sku:"PAN-2015",title:"Non-stick sauté pan",description:"Durable sauté pan with an even-heating base and comfortable stay-cool handle.",category:"Kitchen and dining"},
{row:17,sku:"KTL-2016",title:"ELECTRIC KETTLE",description:"",category:"Kitchen and dining"},
{row:18,sku:"CHR-2017",title:"Ergonomic desk chair",description:"Adjustable lumbar support breathable mesh back and durable rolling base for everyday office work.",category:"Furniture"},
{row:19,sku:"DSK-2018",title:"Compact standing desk",description:"Electric standing desk with programmable heights and a durable scratch-resistant top.",category:"Furniture"},
{row:20,sku:"SHE-2019",title:"Modular storage shelf",description:"Flexible storage shelf with tool-free assembly and adjustable compartments.",category:"Furniture"},
{row:21,sku:"LMP-2020",title:"Minimal task lamp",description:"Focused warm light with three brightness settings and a compact weighted base.",category:"Home office"},
{row:22,sku:"BAG-2021",title:"Commuter laptop bag",description:"",category:"Bags"},
{row:23,sku:"TOTE-2022",title:"Canvas market tote",description:"Reinforced cotton tote with interior pockets and comfortable shoulder straps.",category:"Bags"},
{row:24,sku:"PCH-2023",title:"TECH ACCESSORY POUCH",description:"small pouch",category:"Bags"},
{row:25,sku:"BPK-2024",title:"Weatherproof day backpack",description:"Lightweight backpack with padded laptop storage and a weather-resistant outer shell.",category:"Bags"},
];
const stop=new Set(["the","a","an","and","or","of","for","with","what","which","show","me","in","to","are","is","have","has","our","catalog"]);
const terms=(v:string)=>v.toLowerCase().replace(/[^a-z0-9-]/g," ").split(/\s+/).filter(t=>t.length>1&&!stop.has(t));
export function retrieveRows(question:string,rows=DEMO_CATALOG,limit=6){const query=terms(question);return rows.map(item=>{const haystack=terms(`${item.sku} ${item.title} ${item.description} ${item.category}`);const score=query.reduce((sum,term)=>sum+haystack.reduce((n,word)=>n+(word===term?4:word.includes(term)||term.includes(word)?1:0),0),0)+(!item.description&&query.some(x=>["missing","empty","incomplete","quality","problem","weakest"].includes(x))?8:0)+(item.description.length>0&&item.description.length<30&&query.some(x=>["short","weak","weakest","quality","problem"].includes(x))?5:0);return{item,score};}).sort((a,b)=>b.score-a.score||a.item.row-b.item.row).slice(0,limit).map(({item})=>item);}
