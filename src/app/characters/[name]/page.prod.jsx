export default function CharacterPage({ params }) {
    return (
      <div>
        <h1>Character: {params.name}</h1>
        {/* 这里添加角色详细信息的展示逻辑 */}
      </div>
    );
  }