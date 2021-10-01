---
layout: base.njk
---

# Work Experience

{% for company in resume.work %}
## {{ company.company }}
#### {{ company.position }}  •  {{ company.location }}   •  {{ company.startDate }} to {{ company.endDate }}
{% for highlight in company.highlights %}
  * {{highlight}}
{% endfor %}
{% endfor %} 