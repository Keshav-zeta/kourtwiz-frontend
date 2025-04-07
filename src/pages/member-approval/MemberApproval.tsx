import { toast } from 'react-toastify';
import './MemberApproval.css';
import { useGetPendingUsers } from '../../features/member-approval/apis/useGetPendingUsers';
import { useMutateApproveMember } from '../../features/member-approval/apis/useMutateApproveMember';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { useGetOrganizations } from '../../features/subscription/api/useGetOrganization';

const RequestsPage = () => {
  const { user } = useContext(AuthContext)!;
  const [userOrgData, setUserOrgdata] = useState(null);
  const { data: organizationData, isLoading: loadingOrg } =
    useGetOrganizations();
  const { data: pendingUsers, isLoading: isLoadingPendingUSers } =
    useGetPendingUsers(userOrgData?.id);
  const { mutate: approveUser } = useMutateApproveMember({
    onSuccessCallback: () => {
      toast.success('User approved successfully!');
    },
    onErrorCallback: () => {
      toast.error('Failed to approve user!');
    },
  });
  useEffect(() => {
    if (user && organizationData) {
      let adminOrgName = null;
      let orgData = null;
      console.log('user : ', user);
      for (let i = 0; i < user?.userOrganizationRole.length; i++) {
        if (user?.userOrganizationRole[i]['roleName'] === 'Club Admin') {
          adminOrgName = user?.userOrganizationRole[i]?.organizationName;
          break;
        }
      }
      for (let i = 0; i < organizationData.length; i++) {
        console.log(organizationData[i]);
        if (organizationData[i]['name'] === adminOrgName) {
          orgData = organizationData[i];
          break;
        }
      }
      console.log('admin data : ', adminOrgName);
      setUserOrgdata(orgData);
    }
  }, [user, organizationData]);
  if (isLoadingPendingUSers || loadingOrg) return 'loading...';
  return (
    <div className='RequestsPage'>
      <h2>Pending Approvals</h2>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user: any) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button
                    className='approve-btn'
                    onClick={() => {
                      approveUser(user.id);
                    }}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
            {pendingUsers.length === 0 && <p>No pending approvals</p>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsPage;
