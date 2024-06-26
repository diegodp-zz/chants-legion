// components/ChatMessages.tsx
import { useMessage } from "@/providers/Message/MessageProvider";
import { useEffect, useState } from "react";
import { useUsers } from "@/providers/Users/UsersProvider";
import { ChatMessage } from "@/providers/Message/message-server";

export const ChatMessages = () => {
  const { chatMessages } = useMessage();
  const { users } = useUsers();
  const [messages, setMessages] = useState<Partial<ChatMessage>[]>([]);

  useEffect(() => {
    if (chatMessages) {
      setMessages((messages) => [...messages, ...chatMessages]);
    }
  }, [chatMessages]);

  const textFormatted = messages
    ?.map(({ id, text }) => {
      const foundUser = users.find((user) => user.id === id);

      if (foundUser?.name) {
        return `${foundUser.name}: ${text}`;
      }

      return `${id}: ${text}`;
    })
    .join("\n");

  return (
    <textarea
      className="textarea textarea-bordered w-full flex-1 resize-none rounded-2xl textarea-primary overflow-visible"
      readOnly
      key={JSON.stringify(messages)}
      value={textFormatted}
      onChange={() => {}}
    ></textarea>
  );
};
