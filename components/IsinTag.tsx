import { Tag, TagLeftIcon, TagLabel } from "@chakra-ui/react";

type Props = {
  id: string;
  icon: any | undefined;
  label: string;
  onClick: (id: string) => void;
};

const IsinTag = (props: Props) => {
  const { id, icon, label, onClick } = props;
  return (
    <Tag
      size="md"
      variant="subtle"
      cursor="pointer"
      onClick={() => onClick(id)}
    >
      <TagLeftIcon as={icon} />
      <TagLabel>{label}</TagLabel>
    </Tag>
  );
};

export default IsinTag;
