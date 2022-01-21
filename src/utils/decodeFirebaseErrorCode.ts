export default function decodeFirebaseErrorCode(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Já existe um usuário cadastrado com este e-mail.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/user-not-found':
      return 'Usuário não cadastrado.';
    case 'auth/popup-closed-by-user':
      return 'Popup fechado pelo usuário';
    case 'auth/requires-recent-login':
      return 'O último horário de acesso do usuário não atende ao limite de segurança. Por favor, saia e entre da sua conta e tente novamente';
    case 'auth/network-request-failed':
      return 'Sem conexão com a internet';
    default:
      return 'Ocorreu um erro. Tente novamente mais tarde.';
  }
}
