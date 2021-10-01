---
layout: base.njk
---

# Projects

{% for project in resume.projects %}
## [{{ project.name }}]({{ project.website }})
#### {{ project.summary }}
{% endfor %} 