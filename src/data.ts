export interface InteractableData {
  id: string
  title: string
  description: string
  /** Anchor on the floor; distance is measured in the XZ plane. */
  position: [number, number, number]
  radius: number
}

export const INTERACTABLES: InteractableData[] = [
  {
    id: 'sculpture',
    title: 'Trefoil Study No. 3',
    description:
      'A polished steel torus knot on a plinth. Its single continuous loop has no beginning or end, a nod to the idea that good architecture should flow from one space into the next.',
    position: [-4, 0, -2],
    radius: 2.2,
  },
  {
    id: 'painting',
    title: 'Dusk in Three Circles',
    description:
      'An abstract canvas built from three overlapping discs. The warm and cool tones were chosen to echo the oak floor and the pale daylight from the window.',
    position: [0, 0, -4.2],
    radius: 2.4,
  },
  {
    id: 'record',
    title: 'Turntable',
    description:
      'A belt-drive turntable on a walnut sideboard. The platter is always spinning: the room is designed to be heard as much as seen.',
    position: [4.5, 0, -3.9],
    radius: 2.2,
  },
]
