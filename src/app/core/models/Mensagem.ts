import { Converter } from "./converter";

export interface Mensagem {
  id?: string;
  mensagem: string;
  photoURL: string;
  createAt: Date;
  usuarioId?: string;
  usuarioName?: any;
}


export const MensagemConveter: Converter<Mensagem> = {
  toFirestore: (doc) => doc,
  fromFirestore: (snapshot, options) => {
    const obj = snapshot.data(options)!;

    return {
      ...obj,
      createAt: obj['createAt']?.toDate(),
    } as Mensagem;
  },
};
