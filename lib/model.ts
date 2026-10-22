export type Customer={id:string;name:string;phone:string;email:string;address:string};
export type Staff={id:string;name:string;cost:number;active:boolean};
export type Job={id:string;customerId:string;service:string;date:string;time:string;hours:number;cleaners:number;rate:number;staffIds:string[];costs:Record<string,number>;status:string;actualHours:number|null;machinery:number;machineCost:number;transport:number;transportCost:number;materials:number;materialCost:number;notes:string};
export type Invoice={id:string;number:string;jobId:string;customer:Customer;company:Settings;lines:{label:string;qty:number;rate:number;amount:number}[];subtotal:number;tax:number;total:number;cost:number;paid:number;payments:{id:string;amount:number;date:string}[];issued:string};
export type Settings={name:string;address:string;phone:string;email:string;website:string;trn:string;rate:number;tax:number;logo:string};
export type State={customers:Customer[];staff:Staff[];jobs:Job[];invoices:Invoice[];settings:Settings};
export const stages=['Requested','Confirmed','Assigned','In progress','Completed','Invoiced'];
export const initial:State={customers:[],staff:[],jobs:[],invoices:[],settings:{name:'FAMMA Cleaner Company LLC',address:'Dubai, UAE',phone:'',email:'',website:'',trn:'',rate:35,tax:0,logo:''}};
export const round=(v:number)=>Math.round((v+Number.EPSILON)*100)/100;
export function totals(j:Job){const h=j.actualHours??j.hours;const revenue=round(j.cleaners*h*j.rate+j.machinery+j.transport+j.materials);const labor=round(j.staffIds.reduce((a,id)=>a+(j.costs[id]||0)*h,0));const cost=round(labor+j.machineCost+j.transportCost+j.materialCost);return {revenue,cost,profit:round(revenue-cost),labor};}
function num(v:unknown,label:string,max=1000000){if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>max)throw Error('Invalid '+label);return v;}
function str(v:unknown,label:string,max=500){if(typeof v!=='string'||v.length>max)throw Error('Invalid '+label);return v.trim();}
const id=()=>crypto.randomUUID();
export function apply(s:State,action:string,p:any):State{
 s=structuredClone(s);
 if(action==='customer'){const c={id:id(),name:str(p.name,'name',120),phone:str(p.phone,'phone',60),email:str(p.email,'email',200),address:str(p.address,'address')};if(!c.name||!c.phone)throw Error('Customer name and mobile are required');s.customers.push(c);}
 else if(action==='staff'){const name=str(p.name,'name',120);if(!name)throw Error('Name is required');s.staff.push({id:id(),name,cost:num(p.cost,'hourly cost',10000),active:true});}
 else if(action==='settings'){const t={...s.settings};for(const key of ['name','address','phone','email','website','trn'] as const)t[key]=str(p[key],key);t.rate=num(p.rate,'selling rate',10000);t.tax=num(p.tax,'tax',100);t.logo=str(p.logo,'logo',300000);if(t.logo&&!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(t.logo))throw Error('Use a PNG, JPEG or WebP logo');if(!t.name)throw Error('Company name required');s.settings=t;}
 else if(action==='job'){
 if(!s.customers.some(c=>c.id===p.customerId))throw Error('Select a customer');
 const hours=num(p.hours,'hours',24),cleaners=num(p.cleaners,'cleaners',100);if(!hours||!Number.isInteger(cleaners)||cleaners<1)throw Error('Enter positive hours and cleaner count');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.time))throw Error('Date and time required');
 const date=new Date(p.date+'T'+p.time+':00+04:00');if(!Number.isFinite(+date)||new Date(p.date).toISOString().slice(0,10)!==p.date)throw Error('Invalid date');
 const j:Job={id:id(),customerId:p.customerId,service:str(p.service,'service',100),date:p.date,time:p.time,hours,cleaners,rate:num(p.rate,'selling rate',10000),staffIds:[],costs:{},status:'Requested',actualHours:null,machinery:0,machineCost:0,transport:0,transportCost:0,materials:0,materialCost:0,notes:str(p.notes||'','notes')};
 for(const k of ['machinery','machineCost','transport','transportCost','materials','materialCost'] as const)j[k]=num(p[k]??0,k);if(!j.service)throw Error('Service required');s.jobs.push(j);
 }
 else if(action==='updateJob'){
 const j=s.jobs.find(j=>j.id===p.id);if(!j)throw Error('Booking not found');if(j.status==='Invoiced')throw Error('Invoiced bookings are locked');
 if(!stages.includes(p.status)||p.status==='Invoiced')throw Error('Invalid stage');
 if(!Array.isArray(p.staffIds)||new Set(p.staffIds).size!==p.staffIds.length||p.staffIds.length>j.cleaners)throw Error('Invalid cleaner assignment');
 const h=p.actualHours===null?null:num(p.actualHours,'actual hours',24);if(h===0)throw Error('Actual hours must be positive');
 if(['Assigned','In progress','Completed'].includes(p.status)&&p.staffIds.length!==j.cleaners)throw Error('Assign all requested cleaners first');
 if(p.status==='Completed'&&h===null)throw Error('Approve actual hours before completing');
 const start=+new Date(j.date+'T'+j.time+':00+04:00'),end=start+(h??j.hours)*3600000;
 for(const sid of p.staffIds){const staff=s.staff.find(t=>t.id===sid&&t.active);if(!staff)throw Error('Cleaner unavailable');for(const other of s.jobs){if(other.id===j.id||!other.staffIds.includes(sid))continue;const os=+new Date(other.date+'T'+other.time+':00+04:00');if(start<os+(other.actualHours??other.hours)*3600000&&end>os)throw Error(staff.name+' has an overlapping booking');}j.costs[sid]=j.costs[sid]??staff.cost;}
 j.staffIds=p.staffIds;j.actualHours=h;j.status=p.status;
 }
 else if(action==='invoice'){
 const j=s.jobs.find(j=>j.id===p.id);if(!j||j.status!=='Completed')throw Error('Complete and approve the job first');if(s.invoices.some(i=>i.jobId===j.id))throw Error('Invoice already exists');
 const c=s.customers.find(c=>c.id===j.customerId)!;const t=totals(j);const qty=j.cleaners*j.actualHours!;
 const lines=[{label:j.service+' · '+j.cleaners+' cleaners × '+j.actualHours+' hours',qty,rate:j.rate,amount:round(qty*j.rate)}];for(const [label,amount] of [['Machinery',j.machinery],['Transportation',j.transport],['Materials',j.materials]] as [string,number][])if(amount)lines.push({label,qty:1,rate:amount,amount});
 const tax=round(t.revenue*s.settings.tax/100);s.invoices.push({id:id(),number:'FAM-'+String(s.invoices.length+1).padStart(5,'0'),jobId:j.id,customer:c,company:{...s.settings},lines,subtotal:t.revenue,tax,total:round(t.revenue+tax),cost:t.cost,paid:0,payments:[],issued:new Date().toISOString()});j.status='Invoiced';
 }
 else if(action==='payment'){const inv=s.invoices.find(i=>i.id===p.id);if(!inv)throw Error('Invoice not found');const amount=round(num(p.amount,'payment'));if(!amount||amount>round(inv.total-inv.paid))throw Error('Payment must be positive and within the outstanding balance');inv.paid=round(inv.paid+amount);inv.payments.push({id:id(),amount,date:new Date().toISOString()});}
 else throw Error('Unknown action');
 return s;
}
