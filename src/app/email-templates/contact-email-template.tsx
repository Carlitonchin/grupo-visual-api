interface props {
  name: string;
  phone: string;
  age: string;
  email: string;
  city: string;
  state: string;
  message: string;
  course: string;
}
export default function ContactEmailTemplate({
  name,
  phone,
  age,
  email,
  city,
  state,
  message,
  course,
}: props) {
  return (
    <table>
      <tr>
        <td>
          <strong>Nome Completo:</strong>
        </td>
        <td>{name}</td>
      </tr>
      <tr>
        <td>
          <strong>Telefone:</strong>
        </td>
        <td>{phone}</td>
      </tr>
      <tr>
        <td>
          <strong>Idade:</strong>
        </td>
        <td>{age}</td>
      </tr>
      <tr>
        <td>
          <strong>Curso:</strong>
        </td>
        <td>{course}</td>
      </tr>
      <tr>
        <td>
          <strong>Email:</strong>
        </td>
        <td>{email}</td>
      </tr>
      <tr>
        <td>
          <strong>Estado:</strong>
        </td>
        <td>{state}</td>
      </tr>
      <tr>
        <td>
          <strong>Cidade:</strong>
        </td>
        <td>{city}</td>
      </tr>
      <tr>
        <td>
          <strong>Mensagem:</strong>
        </td>
      </tr>
      <tr>
        <td>{message}</td>
      </tr>
    </table>
  );
}
