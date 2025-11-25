# Sir James Adventures Book002 - Team Playbook
**Created:** November 24, 2025  
**Purpose:** Team collaboration guide for Book002 image/audio production  
**Audience:** Development team, content creators, QA testers

---

## Team Roles & Responsibilities

### 🎬 Project Lead (Acting Master)
**Primary Responsibilities:**
- Overall project direction and decisions
- API key management and budget oversight
- Quality standards and educational value validation
- Stakeholder communication and progress reporting

**Daily Tasks:**
- Review generation progress and costs
- Validate content quality and age-appropriateness
- Coordinate between team members
- Update project status documentation

**Tools Used:**
- `tools/local_agent.py` for project management
- `BOOK002_STATUS.md` for progress tracking
- Netlify dashboard for deployment monitoring

---

### 🎨 Content Curator (Gemini Agent)
**Primary Responsibilities:**
- Convert chapter themes to visual scene descriptions
- Maintain character consistency across all images
- Generate age-appropriate content prompts
- Ensure educational virtue alignment

**Key Files:**
- `netlify/functions/curate-media.ts`
- `AGENTS.md` (agent definitions)
- `Docs/narrator_rules.yaml` (content guidelines)

**Quality Standards:**
- All content suitable for ages 5-8
- Bright, colorful visual style
- Character personalities consistent
- Virtue choices clearly presented

---

### ✍️ Story Narrator (Gemini Agent)
**Primary Responsibilities:**
- Generate engaging chapter narratives
- Create dialogue for Sir James, Claude, and Gramps
- Ensure story flow and educational value
- Maintain voice consistency

**Key Files:**
- `netlify/functions/narrate-project.ts`
- `Docs/voices.yaml` (character voice specs)
- Chapter scene definitions from `orchestrate_book002.py`

**Quality Standards:**
- Age-appropriate language and complexity
- Clear virtue choice points
- Engaging storytelling
- Character voice consistency

---

### 🗣 Voice Agent (ElevenLabs Integration)
**Primary Responsibilities:**
- Synthesize character voices using ElevenLabs API
- Generate narration audio for each scene
- Mix audio with background music
- Ensure audio quality and consistency

**Voice Configuration:**
- **Sir James:** Child voice, age 5-7, enthusiastic
- **Claude:** Playful dog sounds, loyal companion
- **Gramps:** Warm grandfather voice, wise and gentle

**Key Files:**
- `netlify/functions/text-to-speech.ts` (to be implemented)
- Voice ID configurations in `.env.local`

---

### 🎵 Music Composer (Suno Integration)
**Primary Responsibilities:**
- Generate background music for each chapter
- Match music mood to chapter themes
- Ensure child-appropriate compositions
- Optimize audio for web delivery

**Music Themes by Chapter:**
- Ch1: Adventure begins (upbeat, optimistic)
- Ch2: Forest mystery (gentle, curious)
- Ch3: Hidden archive (discovery, wonder)
- Ch4: Mountain challenge (determined, steady)
- Ch5: River crossing (flowing, teamwork)
- Ch6: Village help (warm, community)
- Ch7: Storm weather (dramatic but not scary)
- Ch8: Treasure map (excitement, mystery)
- Ch9: Dragon encounter (brave, heroic)
- Ch10: Homecoming (reflective, heartwarming)

---

### 🎞 Chapter Compiler (HTML Assembly)
**Primary Responsibilities:**
- Assemble generated assets into HTML chapters
- Implement interactive decision points
- Ensure responsive design and accessibility
- Optimize for web performance

**Key Files:**
- HTML templates in `public-book002/`
- CSS styles for consistent theming
- JavaScript for interactivity

**Quality Standards:**
- Mobile-responsive design
- ARIA labels for accessibility
- Fast loading (<3 seconds)
- Cross-browser compatibility

---

### ✨ Attribution Agent (Documentation)
**Primary Responsibilities:**
- Credit all AI systems used in generation
- Track costs and generation metadata
- Maintain Commons Good compliance
- Generate transparency reports

**Documentation Files:**
- `AGENTS.md` (agent definitions)
- `BOOK002_STATUS.md` (progress tracking)
- Cost tracking logs
- Generation metadata

---

## Workflow Processes

### Phase 1: Chapter Generation (Per Chapter)
```
1. Content Curation (Gemini)
   ↓
2. Image Generation (DALL-E 3)
   ↓
3. Narrative Generation (Gemini)
   ↓
4. Voice Synthesis (ElevenLabs)
   ↓
5. Music Generation (Suno)
   ↓
6. Chapter Assembly (HTML)
   ↓
7. Quality Review
   ↓
8. Attribution Documentation
```

### Daily Standup Process
**Time:** 15 minutes
**Participants:** All team members
**Agenda:**
1. Yesterday's accomplishments
2. Today's priorities
3. Blockers or issues
4. Cost/budget status
5. Quality concerns

### Weekly Review Process
**Time:** 1 hour
**Participants:** Project Lead, Content Curator, QA
**Agenda:**
1. Chapter completion review
2. Cost analysis and optimization
3. Quality metrics assessment
4. User feedback incorporation
5. Next week planning

---

## Quality Assurance Process

### Pre-Generation Checklist
- [ ] API keys validated and working
- [ ] Chapter theme and virtue defined
- [ ] Character reference photos ready
- [ ] Scene descriptions reviewed
- [ ] Budget allocation confirmed

### Post-Generation Review
**Image Quality:**
- [ ] Character consistency maintained
- [ ] Art style consistent across scenes
- [ ] Age-appropriate content
- [ ] Technical quality (resolution, format)

**Audio Quality:**
- [ ] Voice consistency across chapters
- [ ] Audio levels normalized
- [ ] Background music balanced
- [ ] No inappropriate content

**Interactive Quality:**
- [ ] All decision points functional
- [ ] Progress saving works
- [ ] Mobile responsive
- [ ] Accessibility features working

**Educational Quality:**
- [ ] Virtue choices clear and meaningful
- [ ] Age-appropriate complexity
- [ ] Educational value present
- [ ] Story engagement maintained

---

## Communication Protocols

### Issue Reporting
**Critical Issues (Immediate):**
- API failures or cost overruns
- Inappropriate content generated
- Security vulnerabilities
- Deployment failures

**Standard Issues (24 hours):**
- Quality inconsistencies
- Performance issues
- User experience problems
- Documentation gaps

### Progress Updates
**Daily:** Slack/Teams message with chapter status
**Weekly:** Email summary with cost and quality metrics
**Milestone:** Full report with stakeholder presentation

### Documentation Standards
- All changes committed with clear messages
- Documentation updated before feature completion
- Code comments for complex logic
- README files updated for major changes

---

## Tools & Environment Setup

### Required Tools
```bash
# Development Environment
- Python 3.10+ (for orchestration scripts)
- Node.js 18+ (for Netlify functions)
- Git (for version control)
- VS Code (recommended IDE)

# API Access
- Google Generative AI (Gemini)
- OpenAI (DALL-E 3)
- ElevenLabs (voice synthesis)
- Suno (music generation)
- Netlify (deployment)
```

### Local Development Setup
```bash
# 1. Clone repository
git clone https://github.com/WSP001/SirJamesAdventures.git
cd SirJamesAdventures

# 2. Install dependencies
npm install
pip install -r requirements.txt

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with API keys

# 4. Validate setup
python tools/local_agent.py setup
python tools/local_agent.py validate
python tools/local_agent.py test
```

### Testing Commands
```bash
# Test individual components
python tools/local_agent.py test                    # API connections
python tools/local_agent.py validate --chapter 1   # Chapter validation
python tools/local_agent.py generate --chapter 1   # Chapter generation

# Run full pipeline
python orchestrate_book002.py                      # Python pipeline
npm run build                                       # TypeScript build
netlify dev                                        # Local testing
```

---

## Cost Management

### Budget Allocation
- **Images (DALL-E 3):** $3.20 (10 chapters × 8 scenes × $0.04)
- **Audio (ElevenLabs):** $1.50 (10 chapters × $0.15)
- **Music (Suno):** $1.00 (10 chapters × $0.10)
- **Narration (Gemini):** $0.30 (10 chapters × $0.03)
- **Total Budget:** $6.00

### Cost Tracking
- Real-time cost monitoring in `BOOK002_STATUS.md`
- Daily cost alerts at 80% budget threshold
- Weekly cost optimization review
- Monthly cost reporting to stakeholders

### Optimization Strategies
- Batch API calls to reduce overhead
- Cache repeated requests
- Use cheaper models for non-critical tasks
- Monitor token usage carefully

---

## Risk Management

### Technical Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API rate limits | Medium | High | Implement retry logic, use queues |
| Cost overruns | Medium | Medium | Real-time monitoring, alerts |
| Generation failures | Low | High | Fallback content, manual review |
| Performance issues | Medium | Medium | Optimization, CDN usage |

### Content Risks
| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Inappropriate content | Low | High | Content review, filters |
| Character inconsistency | Medium | Medium | Reference photos, style guides |
| Educational value loss | Low | High | Expert review, testing |
| Copyright issues | Low | High | Original content only |

---

## Success Metrics

### Technical Metrics
- [ ] All 10 chapters generated successfully
- [ ] Total cost under $10.00
- [ ] Page load time <3 seconds
- [ ] 99% uptime on deployment
- [ ] Mobile compatibility 100%

### Educational Metrics
- [ ] Virtue choice completion rate >80%
- [ ] Parent engagement >60%
- [ ] Age-appropriate content validated
- [ ] Educational effectiveness measured

### User Experience Metrics
- [ ] User satisfaction >4.5/5
- [ ] Session duration >10 minutes
- [ ] Return visitor rate >40%
- [ ] Accessibility compliance 100%

---

## Emergency Procedures

### API Outage Response
1. Switch to fallback content
2. Notify stakeholders immediately
3. Implement manual workarounds
4. Document outage and recovery

### Content Issue Response
1. Immediately remove inappropriate content
2. Review generation process
3. Implement additional filters
4. Re-generate affected content

### Budget Emergency Response
1. Pause non-essential generation
2. Review cost optimization options
3. Notify stakeholders of impact
4. Adjust scope if necessary

---

## Onboarding New Team Members

### First Day
1. Set up development environment
2. Review project documentation
3. Meet with team members
4. Understand role and responsibilities

### First Week
1. Complete local setup validation
2. Review existing chapters
3. Participate in generation process
4. Understand quality standards

### First Month
1. Lead chapter generation
2. Contribute to process improvements
3. Participate in quality reviews
4. Understand full workflow

---

## Contact Information

### Project Leadership
- **Acting Master:** [Contact info]
- **Technical Lead:** [Contact info]
- **Content Lead:** [Contact info]

### Key Resources
- **Project Repository:** https://github.com/WSP001/SirJamesAdventures
- **Documentation:** `Docs/` folder
- **Status Tracking:** `BOOK002_STATUS.md`
- **Issue Tracking:** GitHub Issues

### Communication Channels
- **Daily Standup:** [Slack/Teams channel]
- **Urgent Issues:** [Direct contact info]
- **Stakeholder Updates:** [Email distribution]

---

## Conclusion

This playbook serves as the definitive guide for Sir James Adventures Book002 development. By following these processes, maintaining quality standards, and communicating effectively, we can successfully transform the emoji-based Book001 into a rich, multimedia Book002 experience while preserving the educational value and heart of the original stories.

**Mission:** Create engaging, educational multimedia adventures that teach virtues through interactive storytelling.

**Values:** Quality, Education, Accessibility, Transparency, Commons Good.

**Success:** When children love learning virtues through Sir James's adventures.

---

*Last Updated: November 24, 2025*  
*Next Review: After Chapter 1 generation complete*  
*Maintained by: Project Lead*
