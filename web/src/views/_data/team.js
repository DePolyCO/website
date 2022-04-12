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
    const team = await client.fetch(groq`*[_type == 'team']{
      __i18n_lang,
      "members":teamMembers[]->{
      name,
      img,
      role,
      bio,
      social
    },
      "advisors":teamAdvisors[]->{
      name,
      img,
      role,
      bio,
      social
    }
    }[0]
    `);

    const data = {
      advisors: team.advisors.map((advisor) => {
        return {
          ...advisor,
          bio: advisor.bio
            ? toHTML(advisor.bio, { components: bioComponents })
            : advisor.bio,
        };
      }),
      members: team.members.map((member) => {
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
  "team",
  "1d"
);
