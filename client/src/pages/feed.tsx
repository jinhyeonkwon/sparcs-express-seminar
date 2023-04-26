import React from 'react';
import axios from 'axios';
import { SAPIBase } from '../tools/api';
import Header from '../components/header';
import './css/feed.css';

interface IAPIResponse {
  _id: string;
  title: string;
  content: string;
  itemViewCnt: number;
}

const FeedPage = (props: {}) => {
  const [LAPIResponse, setLAPIResponse] = React.useState<IAPIResponse[]>([]);
  const [NPostCount, setNPostCount] = React.useState<number>(0);
  const [SNewPostTitle, setSNewPostTitle] = React.useState<string>('');
  const [SNewPostContent, setSNewPostContent] = React.useState<string>('');
  const [SSearchItem, setSSearchItem] = React.useState<string>('');
  const [SEditPostTitle, setSEditPostTitle] = React.useState<string>('');
  const [SEditPostContent, setSEditPostContent] = React.useState<string>('');
  const [SEditingID, setSEditingID] = React.useState<string>('');
  const [NEditCount, setNEditCount] = React.useState<number>(0);

  React.useEffect(() => {
    let BComponentExited = false;
    const asyncFun = async () => {
      const { data } = await axios.get<IAPIResponse[]>(
        SAPIBase + `/feed/getFeed?count=${NPostCount}&search=${SSearchItem}`
      );
      console.log(data);
      // const data = [ { id: 0, title: "test1", content: "Example body" }, { id: 1, title: "test2", content: "Example body" }, { id: 2, title: "test3", content: "Example body" } ].slice(0, NPostCount);
      if (BComponentExited) return;
      setLAPIResponse(data);
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => {
      BComponentExited = true;
    };
  }, [NPostCount, SSearchItem, NEditCount]);
    const asyncFun = async () => {
        title: SNewPostTitle,
        content: SNewPostContent,
      });
      setNPostCount(NPostCount + 1);
      setSNewPostTitle('');
      setSNewPostContent('');
    };
    asyncFun().catch((e) => window.alert(`AN ERROR OCCURED! ${e}`));
  };

  const deletePost = (id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post(SAPIBase + '/feed/deleteFeed', { id: id });
      setNPostCount(Math.max(NPostCount - 1, 0));
    };
    asyncFun().catch((e) => window.alert(`AN ERROR OCCURED! ${e}`));
  };
  //HW2 : Edit 추가 -----------------------------
  const editPost = (id: string) => {
    const asyncFun = async () => {
      await axios.post(SAPIBase + '/feed/editFeed', {
        id: id,
        title: SEditPostTitle,
        content: SEditPostContent,
      });
      setNEditCount(NEditCount + 1);
      setSEditPostTitle('');
      setSEditPostContent('');
    };
    asyncFun().catch((e) => window.alert(`AN ERROR OCCURED! ${e}`));

    console.log(
      `edited post: id = ${id}, title = ${SEditPostTitle}, content = ${SEditPostContent}`
    );
  };

  const showInput = (id: string) => {
    console.log(`showInput: ${id}`);
    setSEditingID(id);
    console.log(`SEditingID: ${SEditingID}`);
  };
  //---------------------------------------------

  return (
    <div className="Feed">
      <Header />
      <h2>Feed</h2>
      <div className={'feed-length-input'}>
        Number of posts to show: &nbsp;&nbsp;
        <input
          type={'number'}
          value={NPostCount}
          id={'post-count-input'}
          min={0}
          onChange={(e) => setNPostCount(parseInt(e.target.value))}
        />
      </div>
      <div className={'feed-length-input'}>
        Search Keyword: &nbsp;&nbsp;
        <input
          type={'text'}
          value={SSearchItem}
          id={'post-search-input'}
          onChange={(e) => setSSearchItem(e.target.value)}
        />
      </div>
      <div className={'feed-list'}>
        {LAPIResponse.map((val, i) => (
          <div key={i} className={'feed-item'}>
            <div
              className={'delete-item'}
              onClick={(e) => deletePost(`${val._id}`)}
            >
              ⓧ
            </div>
            <div
              className={'edit-item'}
              onClick={(e) => showInput(`${val._id}`)}
            >
              ✒
            </div>
            <h3 className={'feed-title'}>{val.title}</h3>
            <p className={'feed-body'}>{val.content}</p>
            <div
              className={`${SEditingID == `${val._id}` ? 'visible' : 'hidden'}`}
            >
              New Title:{' '}
              <input
                type={'text'}
                value={SEditPostTitle}
                onChange={(e) => setSEditPostTitle(e.target.value)}
              />
              &nbsp;&nbsp;&nbsp;&nbsp; New Content:{' '}
              <input
                type={'text'}
                value={SEditPostContent}
                onChange={(e) => setSEditPostContent(e.target.value)}
              />
              &nbsp;&nbsp;
              <button onClick={(e) => editPost(`${val._id}`)}>Edit!</button>
            </div>
          </div>
        ))}
        <div className={'feed-item-add'}>
          Title:{' '}
          <input
            type={'text'}
            value={SNewPostTitle}
            onChange={(e) => setSNewPostTitle(e.target.value)}
          />
          &nbsp;&nbsp;&nbsp;&nbsp; Content:{' '}
          <input
            type={'text'}
            value={SNewPostContent}
            onChange={(e) => setSNewPostContent(e.target.value)}
          />
          <div className={'post-add-button'} onClick={(e) => createNewPost()}>
            Add Post!
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
