export const sampleChats = [
  {
    avatar: [""],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["", "", "", ""],
    name: "Jack Bauer",
    _id: "2",
    groupChat: true,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: "",
    name: "Jack Bauer",
    _id: "1",
  },
  {
    avatar: "",
    name: "Jack Doe",
    _id: "2",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: "",
      name: "Jack Yu",
    },
    _id: "3",
  },
  {
    sender: {
      avatar: "",
      name: "Angela Yu",
    },
    _id: "4",
  },
];

export const sampleMessage = [
  {
    attachments: [],
    content: "Some example message 1...",
    _id: "sdbhbefurbbhjjwjhvarf3",
    sender: {
      _id: "user._id",
      name: "John Doe",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:40:30.630Z",
  },
  {
    attachments: [
      {
        public_id: "dgudgf",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "",
    _id: "sdbhbefurbbhjjwjhva",
    sender: {
      _id: "ddvb",
      name: "John Doe",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:40:30.630Z",
  },
];

export const dashboardData = {
  users: [
    {
      name: "John Doe",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "1",
      username: "john_doe",
      friends: 20,
      groups: 5,
    },
    {
      name: "Jack Doe",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "2",
      username: "jack_doe",
      friends: 10,
      groups: 15,
    },
  ],
  chats: [
    {
      name: "John Doe Group",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "1",
      groupChat: false,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalMembers: 2,
      totalMessages: 20,
      creator: {
        name: "John Doe",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
    {
      name: "IIEST Official",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "2",
      groupChat: true,
      members: [
        { _id: "1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalMembers: 2,
      totalMessages: 20,
      creator: {
        name: "Jack Doe",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
  ],
  messages: [
    {
        attachments: [],
        content: "Some message. Hello!",
        _id: "12werfgn",
        sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "Jack Doe",
        },
        chat: "chatId",
        groupChat: false,
        createdAt: "2024-04-12T10:41:30.630Z",
    },
    {
        attachments: [
            {
                public_id: "asdsadds2",
                url: "https://www.w3schools.com/howto/img_avatar.png",
            },
        ],
        content: "Reply of Some message. Hello!",
        _id: "12werfgndfvb",
        sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "Jack Doe",
        },
        chat: "chatId",
        groupChat: true,
        createdAt: "2024-04-12T10:41:30.630Z",
    },
  ]
};
