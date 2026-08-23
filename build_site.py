import os, shutil, yaml, json, liquid, re

os.makedirs('_site', exist_ok=True)
data = {}
for yml in os.listdir('_data'):
    if yml.endswith('.yml') or yml.endswith('.yaml'):
        k = os.path.splitext(yml)[0]
        with open(os.path.join('_data', yml), 'r', encoding='utf-8') as f:
            data[k] = yaml.safe_load(f)

def fix_liquid(c):
    return re.sub(r'{%\s*include\s+([a-zA-Z0-9_\-\.]+)\s*%}', r"{% include '\1' %}", c)

tpl_dict = {}
for root, dirs, files in os.walk('.'):
    if '_site' in root or '.git' in root: continue
    for file in files:
        if file.endswith('.html') or file.endswith('.md'):
            fp = os.path.join(root, file)
            rel = os.path.relpath(fp, '.').replace('\\', '/')
            with open(fp, 'r', encoding='utf-8') as f:
                c = fix_liquid(f.read())
                if c.startswith('---'):
                    parts = c.split('---', 2)
                    if len(parts) >= 3:
                        c = parts[2]
                tpl_dict[rel] = c
                if rel.startswith('_includes/'):
                    tpl_dict[rel[10:]] = c
                if rel.startswith('_layouts/'):
                    tpl_dict[rel[9:]] = c

env = liquid.Environment(loader=liquid.DictLoader(tpl_dict))

def rel_filter(u):
    if u is None or isinstance(u, liquid.undefined.Undefined): return ''
    if u.startswith('/'): return u[1:]
    return u

def jsonify_filter(v):
    if v is None or isinstance(v, liquid.undefined.Undefined): return 'null'
    return json.dumps(v, ensure_ascii=False)

env.filters['relative_url'] = rel_filter
env.filters['jsonify'] = jsonify_filter

layout = env.get_template('default.html')
idx = tpl_dict['index.html']
rendered_body = env.from_string(idx).render(site={'data': data})
final_html = layout.render(site={'data': data}, content=rendered_body)

with open('_site/index.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

shutil.copytree('assets', '_site/assets', dirs_exist_ok=True)
print('Successfully built _site/index.html! Length:', len(final_html))
