---
layout: base.njk
---

# Hi! My name is {{resume.basics.name}}. {{ "👋" | emoji }}

I'm a {{resume.basics.label}} based in {{resume.basics.location.city}}.

Currently I work at [{{resume.work[0].company}}]({{resume.work[0].website}}).

Previously I have worked at [{{resume.work[2].company}}]({{resume.work[2].website}}) and [{{resume.work[3].company}}]({{resume.work[3].website}}).

{% assign profiles = "" %}
{% for profile in resume.basics.profiles reversed %}
    {% assign sc = profile.network | downcase %}
    {% capture profileText %}[{% fortawesomeBrand sc %} {{ profile.network }}]({{profile.url}}){% if forloop.last != true %}, {% endif %}{% endcapture %}
    
    {% assign profiles = profiles | append: profileText %}
{% endfor %}

You can find me elsewhere on the internet: {{profiles}}.

Contact me: [{% fortawesomeRegular 'paper-plane' %} {{ resume.basics.email }}](mailto:{{ resume.basics.email }})
