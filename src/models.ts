export interface Entry {
    id: string;
    date: string;
    title: string;
    description: string;
    pictureUrl: string;
}

export const toEntry = (doc) => {
    return {id: doc.id, ...doc.data()} as Entry;
}