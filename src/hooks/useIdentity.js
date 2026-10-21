import { useEffect } from 'react';
import { canAddPerson, createPerson, findPerson, partnerOf, withDevice } from '../lib/people';

export function useIdentity({ garden, settings, updateSettings }) {
  const { people } = garden;
  const me = settings ? findPerson(people, settings.personId) : null;
  const partner = partnerOf(people, me);
  const deviceId = settings?.deviceId;

  useEffect(() => {
    if (!me) return;
    const patch = {};
    if (me.name !== settings.author) patch.author = me.name;
    if (me.location && !settings.location) patch.location = me.location;
    if (Object.keys(patch).length > 0) updateSettings(patch);
  }, [me, settings?.author, settings?.location, updateSettings]);

  async function become(person) {
    await garden.savePerson(withDevice(person, deviceId));
    await updateSettings({ personId: person.id, author: person.name, location: settings.location ?? person.location });
  }

  async function create(name) {
    const person = createPerson(name, { deviceId, location: settings.location });
    await garden.savePerson(person);
    await updateSettings({ personId: person.id, author: person.name });
  }

  return {
    people,
    me,
    partner,
    needsSetup: Boolean(settings) && garden.loaded && !me,
    canAddPerson: canAddPerson(people),
    become,
    create,
    update: async (patch) => me && garden.savePerson({ ...me, ...patch }),
    leave: () => updateSettings({ personId: '' }),
    joinGarden: (storage) => updateSettings({ storage: { ...settings.storage, ...storage } }),
  };
}
