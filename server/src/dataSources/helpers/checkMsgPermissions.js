import { TE } from '../../utils';
import { ERROR } from '../../const';
import checkAuth from './checkAuth';
import checkChatPermissions from './checkChatPermissions';

const { NOT_FOUND } = ERROR;

async function checkMsgPermissions(msgId, isOwner = false) {
  let message;
  const { Message } = this.models;
  const userId = checkAuth(this.ctx);

  if (isOwner) {
    try {
      [message] = await Message.findAll({
        where: {
          ownerId: userId,
          id: msgId,
        },
      });
    } catch (err) {
      TE(err);
    }

    if (!message) {
      TE(NOT_FOUND);
    }
  } else {
    try {
      [message] = await Message.findAll({
        where: {
          id: msgId,
        },
      });
    } catch (err) {
      TE(err);
    }

    if (!message) {
      TE(NOT_FOUND);
    }

    await checkChatPermissions.call(this, message.chatId);
  }

  return message;
}

export default checkMsgPermissions;
