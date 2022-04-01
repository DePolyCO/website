const client = require("../../../utils/sanityClient");
const groq = require("groq");

const withCache = require("../../../utils/cache");

const htm = require("htm");
const vhtml = require("vhtml");
const { toHTML } = require("@portabletext/to-html");

const html = htm.bind(vhtml);

const bioComponents = {
  types: {
    fact: ({ value }) => {
      return html`
        <div class="bio-detail--fact">
          <div class="fact-inner">
            <strong>Interesting fact</strong> - ${value.gist}
          </div>

          <div class="fact-tags">
            ${value.tags.map(
              (tag) => html`<span class="chip ttu ">${tag}</span>`
            )}
          </div>
        </div>
      `;
    },
  },

  block: {
    normal: ({ children }) => `<p class="bio-detail--para">${children}</p>`,
  },
};

module.exports = withCache(
  async () => {
    const people = await client.fetch(groq`*[_type == 'person']{
      ...
     }`);

    const team = await client.fetch(groq`*[_type == 'team']{
      "members":teamMembers[]->{
        ...,
      name,
      img,
      role,
      bio,
      social
    },
      "advisors":teamAdvisors[]->{
        ...,
      name,
      img,
      role,
      bio,
      social
    }
    }[0]
    `);

    const members = team.members.map((item) => {
      if (item.__i18n_refs && item.__i18n_refs[0]) {
        return people.filter(
          (member) => member._id === item.__i18n_refs[0]._ref
        )[0];
      }
      return item;
    });

    const advisors = team.advisors.map((item) => {
      if (item.__i18n_refs && item.__i18n_refs[0]) {
        return people.filter(
          (advisor) => advisor._id === item.__i18n_refs[0]._ref
        )[0];
      }
      return item;
    });

    const data = {
      advisors: advisors.map((advisor) => {
        return {
          ...advisor,
          bio: advisor.bio
            ? toHTML(advisor.bio, { components: bioComponents })
            : advisor.bio,
        };
      }),
      members: members.map((member) => {
        return {
          ...member,
          bio: member.bio
            ? toHTML(member.bio, { components: bioComponents })
            : member.bio,
        };
      }),
    };

    return data;
  },
  "team-fra",
  "1d"
);
