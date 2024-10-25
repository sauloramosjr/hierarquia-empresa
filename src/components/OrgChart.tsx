import { useState, useEffect, useCallback } from 'react';

interface Member {
  name: string;
  add: string;
  image_url?: string;
}

interface OrgNode {
  title?: string;
  titleClass?: string;
  extend?: boolean;
  member?: Member[];
  children?: OrgNode[];
}

interface OrganizationChartProps {
  data: OrgNode;
  onClickNode: (node: OrgNode) => void;
}

export function OrganizationChart({
  data,
  onClickNode,
}: OrganizationChartProps) {
  const [orgData, setOrgData] = useState<OrgNode>({} as OrgNode);

  const init = useCallback((orgData: OrgNode) => {
    orgData.extend = true;
    if (Array.isArray(orgData.children)) {
      orgData.children.forEach((c) => {
        init(c);
      });
    }
    setOrgData(orgData);
  }, []);

  const setToggleExtend = (orgData: OrgNode, extend: boolean) => {
    orgData.extend = extend;
    setOrgData({ ...orgData });
  };

  const isChildren = () => {
    return Array.isArray(orgData.children) && orgData.children.length > 0;
  };

  const isMember = () => {
    return Array.isArray(orgData.member) && orgData.member.length > 0;
  };

  useEffect(() => {
    init(data);
  }, []);

  return (
    <table className="org-table">
      <tbody>
        <tr>
          <td
            colSpan={
              isChildren() && orgData.children
                ? orgData.children?.length * 2
                : 1
            }
            className={`${isChildren() ? 'org-parent-level' : ''} ${
              isChildren() && orgData.extend ? 'org-extend' : ''
            }`}
          >
            <div className="org-node">
              <div
                className="org-container"
                onClick={() => onClickNode(orgData)}
              >
                {orgData.title && (
                  <div className={`org-title ${orgData.titleClass || ''}`}>
                    {orgData.title}
                  </div>
                )}
                {isMember() && (
                  <div
                    className={`org-content ${
                      (orgData as any).contentClass || ''
                    }`}
                  >
                    {(orgData as any).member.map(
                      (
                        member: {
                          name: string;
                          add: string;
                          image_url: string;
                        },
                        index: number
                      ) => (
                        <div className="org-content-item" key={index}>
                          <div className="item-box">
                            <p className="item-title">{member.name}</p>
                            <p className="item-add">{member.add}</p>
                          </div>
                          {member.image_url && (
                            <div className="avat">
                              <img
                                src={member.image_url}
                                alt={`${member.name}'s avatar`}
                              />
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
            <div
              className="org-extend-arrow"
              style={{ display: isChildren() ? 'block' : 'none' }}
              onClick={() => setToggleExtend(orgData, !orgData.extend)}
            ></div>
          </td>
        </tr>
        <tr>
          {isChildren() &&
            orgData.extend &&
            (orgData as any).children.map((children: any, index: number) => (
              <td key={index} colSpan={2} className="org-child-level">
                <OrganizationChart data={children} onClickNode={onClickNode} />
              </td>
            ))}
        </tr>
      </tbody>
    </table>
  );
}
