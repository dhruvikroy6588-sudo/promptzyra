import json,glob,re,sys
from urllib.parse import urlparse
C=['audio','career','chat-assistants','coding','design','image','marketing','productivity','research','study','video','writing']
P=['Free','Freemium','Paid','Free trial','Open source','Unknown']
base=json.load(open('content/seed-tools.json'))+json.load(open('content/seed-tools-extra.json'))
slugs={x['slug'] for x in base}; doms={urlparse(x['website_url']).netloc.replace('www.','') for x in base}
new=[];skip=0
for f in sorted(glob.glob('content/tools-parts/t*.json')):
    for x in json.load(open(f)):
        s=x.get('slug','');d=urlparse(x.get('website_url','')).netloc.replace('www.','')
        if not s or s in slugs or (d and d in doms) or not d: skip+=1;continue
        if x.get('category') not in C: x['category']='productivity'
        if x.get('pricing') not in P: x['pricing']='Unknown'
        for k,v in dict(platforms=['Web'],use_steps=[],pros=[],cons=[],alternatives=[],tags=[],features=[],use_cases=[],faq=[]).items(): x.setdefault(k,v)
        x['status']='draft'; x.setdefault('last_checked','unverified')
        slugs.add(s);doms.add(d);new.append(x)
for x in new: x['alternatives']=[a for a in x['alternatives'] if a in slugs]
json.dump(new,open('content/seed-tools-more.json','w'),indent=1,ensure_ascii=False)
print('tools new',len(new),'skipped dup/bad',skip,'total',len(base)+len(new))
T={'agents','commands','settings','hooks','mcps','mods','plugins'};CC={'study-learning','teaching','assessment','writing-research','language','coding-education','productivity','admin-ops'}
out=[];seen=set()
for f in ['content/components-parts/agents-commands.json','content/components-parts/settings-hooks-mods.json','content/components-parts/mcps-plugins.json']+sorted(glob.glob('content/components-parts/c[0-9]*.json')):
    for x in json.load(open(f)):
        if x.get('type') not in T: continue
        s=x['slug']
        if s in seen: s=f"{x['type']}-{s}"; x['slug']=s
        if s in seen: continue
        seen.add(s)
        if x.get('category') not in CC: x['category']='productivity'
        x['stars']=0;x['description']=x['description'][:280];x.setdefault('tags',[]);x.setdefault('files',[]);x.setdefault('install','')
        out.append(x)
json.dump(out,open('content/seed-components.json','w'),indent=1,ensure_ascii=False)
from collections import Counter;print('components',len(out),dict(Counter(x['type'] for x in out)))
