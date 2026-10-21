import { useState } from 'react';
import { readableError } from '../../lib/errors';
import { MAX_PEOPLE, validatePersonName } from '../../lib/people';
import { Button, Field, TextInput } from '../ui/controls';
import { Panel } from '../ui/Panel';
import { Section } from '../ui/Section';
import { PasteInvite } from '../settings/InviteCode';

export function WhoAreYouPanel({ identity, suggestedName }) {
  const [name, setName] = useState(suggestedName ?? '');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const { people, canAddPerson } = identity;

  async function run(action) {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (actionError) {
      setError(readableError(actionError));
      setBusy(false);
    }
  }

  function start() {
    const problem = validatePersonName(name);
    if (problem) return setError(problem);
    return run(() => identity.create(name));
  }

  return (
    <Panel title="Who's this plant for?">
      <div className="flex flex-col gap-3">
        <p className="text-body">
          A garden is shared by {MAX_PEOPLE} people. Choose who uses this computer, so messages reach the right person.
        </p>
        <Section title="Joining your partner's garden?">
          <p className="text-label text-card-text/80">Paste the invite code they sent you first, then pick your name below.</p>
          <PasteInvite onJoin={identity.joinGarden} />
        </Section>
        {people.length > 0 && (
          <Section title="This computer belongs to…">
            <div className="flex flex-wrap gap-1.5">
              {people.map((person) => (
                <Button key={person.id} disabled={busy} onClick={() => run(() => identity.become(person))}>
                  {person.name}
                </Button>
              ))}
            </div>
          </Section>
        )}
        {canAddPerson ? (
          <Section title={people.length > 0 ? "…or I'm new here" : "What's your name?"}>
            <Field label="Your name" error={error}>
              <TextInput value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && start()} />
            </Field>
            <div className="flex justify-end">
              <Button disabled={busy} onClick={start}>
                Start my plant
              </Button>
            </div>
          </Section>
        ) : (
          <p className="text-label text-card-text/70">This garden already has two people, so pick yours above.</p>
        )}
        {error && !canAddPerson && <p className="text-label text-card-accent">{error}</p>}
      </div>
    </Panel>
  );
}
