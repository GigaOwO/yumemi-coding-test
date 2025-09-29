type props = {
  prefName: string;
  prefCode: number;
};

export default function CheckBox({ prefName, prefCode }: props) {
  return (
    <div className="">
      <input type="checkbox" id={prefCode.toString()} />
      <label htmlFor={prefCode.toString()}>{prefName}</label>
    </div>
  );
}
