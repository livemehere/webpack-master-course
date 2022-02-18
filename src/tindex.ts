type Man = {
  name: string;
  age: number;
};

function make(props: Man) {
  return `Hi, ${props.name}`;
}

make({ name: "kong", age: 24 });
