import React, { useContext, useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import Toolbar from '../toolbar/Toolbar';
import { Outlet } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext';
import { useHasPermission } from '../../context/UseHasPermission';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import SideBarList from './components/SideBarList';

import HomeImage from '../../assets/homepage.svg';
import MySchedule from '../../assets/schedule.svg';

import UserIcomImg from '../../assets/userIcoImage.svg';

import { useViewportSize } from '../../shared/components/ViewportSize/useViewPortSize';
import Logo from '../logo/Logo';
import AuthContext from '../../context/AuthContext';

const sidebarItems = [
  {
    label: 'Dashboard',
    icon: <img src={HomeImage} />,
    path: '/home',
    isExpandable: false,
    permission: 'view_home',
  },
  {
    label: 'My Schedules',
    icon: <img src={MySchedule} />,
    path: '/scheduledBookings',
    isExpandable: false,
    permission: 'view_schedules',
  },
  {
    label: 'User',
    path: '/list-users',
    icon: <img src={UserIcomImg} />,
    isExpandable: false,
    permission: 'view_users',
  },
  {
    label: 'Roles',
    icon: <img src={UserIcomImg} />,
    path: '/role-mapping',
    isExpandable: false,
    permission: 'VIEW_ROLES',
  },
  {
    label: 'Subscripton',
    icon: <img src={UserIcomImg} />,
    path: '/subscription',
    isExpandable: false,
    permission: 'VIEW_ROLES',
  },
  {
    label: 'Requests',
    icon: <img src={MySchedule} />,
    path: '/requests',
    isExpandable: false,
  },
  {
    label: 'Approve Members',
    icon: <img src={UserIcomImg} />,
    path: '/approve-members',
    isExpandable: false,
  },
  {
    label: 'Members',
    icon: <img src={UserIcomImg} />,
    path: '/manage-user',
    isExpandable: false,
  },
  {
    label: 'Clubs',
    icon: <img src='src\assets\pickleballclub.svg' />,
    path: '/clubs',
    isExpandable: false,
  },
  {
    label: 'Bookings',
    icon: <img src='src\assets\pickleballclub.svg' />,
    path: '/bookings',
    isExpandable: false,
  },
  {
    label: 'Coach Bookings',
    icon: <img src='src\assets\pickleballclub.svg' />,
    path: '/coach-bookings',
    isExpandable: false,
  },
  {
    label: 'Membership Plans',
    path: '/club/memberships',
    isExpandable: false,
  },
  {
    label: 'Courts',
    path: 'club/court',
    isExpandable: false,
  },
  {
    label: 'Settings',
    path: '/TBD',
    isExpandable: false,
  },
  {
    label: 'Schedules',
    path: '/TBD',
    isExpandable: false,
  },
  {
    label: 'Club Bookings',
    path: '/club-bookings',
    isExpandable: false,
  },
  {
    label: 'Assets',
    path: '/TBD',
    isExpandable: false,
  },
  {
    label: 'Profile',
    path: '/user-managment-get-put',
    isExpandable: false,
  },

  {
    label: 'Open Play',
    path: '/open-play',
    isExpandable: false,
  },
  {
    label: 'Coach',
    path: '/add-coach',
    isExpandable: false,
  },
  {
    label: 'Waitlist',
    path: '/waitlist',
    icon: <img src='src\assets\pickleballclub.svg' />,
    isExpandable: false,
  },
  {
    label: 'Join Open Play',
    path: '/openplay',
    isExpandable: false,
  },
  {
    label: 'Themes',
    path: '/settings-themes',
    isExpandable: false,
  },
];

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>('Home');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { width } = useViewportSize();
  const { user } = useContext(AuthContext)!;
  const userInfo = useUserInfo();
  const navigate = useNavigate();
  const hasPermission = useHasPermission(userInfo.userInfo.role);
  useEffect(() => {
    const sideBarClose = () => {
      if (width > 1024) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };
    sideBarClose();
  }, [width, isMobileMenuOpen]);

  useEffect(() => {
    const mobileSideBarClose = () => {
      if (width < 768) {
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        } else {
          setIsMobileMenuOpen(false);
        }
      } else {
        setIsMobileMenuOpen(false);
      }
    };
    mobileSideBarClose();
  }, [width]);

  const toggleSidenav = () => {
    setIsExpanded((prev) => !prev);
    setIsHovered(false);
  };

  const handleListItemClick = (label: string, parentLabel?: string) => {
    setActiveItem(label);
    if (parentLabel) {
      setOpenItems((prevOpenItems) => ({
        ...prevOpenItems,
        [parentLabel]: true,
      }));
    }
  };

  const handleToggle = (itemLabel: string) => {
    setOpenItems((prevOpenItems) => {
      const isCurrentlyOpen = prevOpenItems[itemLabel];
      return {
        [itemLabel]: !isCurrentlyOpen,
      };
    });
  };

  const closeMobileNav = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMouseEnter = () => {
    if (!isExpanded) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isWelcome = userInfo.userInfo.isWelcome;
  return (
    <div className='app-container'>
      <Drawer
        variant='permanent'
        className={`sidebar sidebar-icon-view ${
          isExpanded ? 'sidebar-open' : 'sidebar-closed'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          '& .MuiDrawer-paper': {
            width: isExpanded ? '260px' : '96px',
            transition: 'width 0.3s cubic-bezier(.05,.72,.6,.97)',
          },
        }}
      >
        <div
          className={`sidebar-content ${
            !isExpanded && 'sidebar-scroll-hidden'
          }`}
        >
          <Logo isExpanded={isExpanded} />
          <div className='sidebar-list-container'>
            <List className='list-items'>
              {sidebarItems.map((item) => {
                // if (!hasPermission(item.permission)) return null;

                const isDisabled = isWelcome;

                if (item.isExpandable) {
                  if (item.label === 'Documents') {
                    return (
                      <React.Fragment key={item.label}>
                        <Tooltip
                          disableHoverListener={isExpanded && !isDisabled}
                          placement='right'
                          title={
                            isDisabled
                              ? 'Complete onboarding to access'
                              : item.label
                          }
                        >
                          <ListItem
                            className={`list-item ${
                              isDisabled ? 'disabled' : ''
                            } ${activeItem === item.label ? 'active' : ''}`}
                            onClick={() => {
                              if (!isDisabled) {
                                if (item.subItems?.length) {
                                  navigate(item.subItems[0].path);
                                }
                                handleToggle(item.label);
                                handleListItemClick(item.label);
                              }
                            }}
                            aria-expanded={openItems[item.label] || false}
                            selected={activeItem === item.label}
                          >
                            <ListItemIcon className='list-item-icon'>
                              {item.icon}
                            </ListItemIcon>
                            {isExpanded && (
                              <ListItemText
                                primary={item.label}
                                className='list-item-text'
                              />
                            )}
                            {isExpanded &&
                              (openItems[item.label] ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              ))}
                          </ListItem>
                        </Tooltip>
                        <Collapse
                          in={openItems[item.label]}
                          timeout='auto'
                          unmountOnExit
                        >
                          <List component='div' disablePadding>
                            {item.subItems?.map((subItem) => (
                              <Tooltip
                                disableHoverListener={isExpanded && !isDisabled}
                                placement='right'
                                className={`list-item sub-item ${
                                  activeItem === subItem.label ? 'active' : ''
                                }`}
                                title={
                                  isDisabled
                                    ? 'Complete onboarding to access'
                                    : subItem.label
                                }
                                key={subItem.label}
                              >
                                <ListItem
                                  key={subItem.label}
                                  className={`list-item sub-item ${
                                    activeItem === subItem.label ? 'active' : ''
                                  }`}
                                  component={Link}
                                  to={subItem.path}
                                  onClick={() => {
                                    if (!isDisabled) {
                                      handleListItemClick(
                                        subItem.label,
                                        item.label
                                      );
                                    }
                                  }}
                                >
                                  <ListItemIcon className='list-item-icon'>
                                    {subItem.icon}
                                  </ListItemIcon>
                                  {isExpanded && (
                                    <ListItemText
                                      primary={subItem.label}
                                      className='list-item-text'
                                    />
                                  )}
                                </ListItem>
                              </Tooltip>
                            ))}
                          </List>
                        </Collapse>
                      </React.Fragment>
                    );
                  } else if (item.label === 'Contacts') {
                    const visibleSubItems =
                      item.subItems?.filter((subItem) =>
                        hasPermission(subItem.permission)
                      ) || [];

                    const hasSubItems = visibleSubItems.length > 0;

                    return (
                      <React.Fragment key={item.label}>
                        <Tooltip
                          disableHoverListener={isExpanded && !isDisabled}
                          placement='right'
                          title={
                            isDisabled
                              ? 'Complete onboarding to access'
                              : item.label
                          }
                        >
                          <ListItem
                            className={`list-item ${
                              isDisabled ? 'disabled' : ''
                            } ${
                              activeItem.startsWith(item.label) ? 'active' : ''
                            }`}
                            component={!isDisabled ? Link : 'div'}
                            to={item.path}
                            onClick={() => {
                              if (!isDisabled) {
                                if (hasSubItems) {
                                  handleToggle(item.label);
                                }
                                handleListItemClick(item.label);
                              }
                            }}
                            aria-expanded={
                              hasSubItems ? openItems[item.label] : undefined
                            }
                            selected={activeItem === item.label}
                          >
                            <ListItemIcon className='list-item-icon'>
                              {item.icon}
                            </ListItemIcon>
                            {isExpanded && (
                              <ListItemText
                                primary={item.label}
                                className='list-item-text'
                              />
                            )}
                            {hasSubItems &&
                              isExpanded &&
                              (openItems[item.label] ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              ))}
                          </ListItem>
                        </Tooltip>
                        {hasSubItems && (
                          <Collapse
                            in={openItems[item.label]}
                            timeout='auto'
                            unmountOnExit
                          >
                            <List component='div' disablePadding>
                              {visibleSubItems.map((subItem) => (
                                <Tooltip
                                  key={subItem.label}
                                  disableHoverListener={
                                    isExpanded && !isDisabled
                                  }
                                  placement='right'
                                  title={
                                    isDisabled
                                      ? 'Complete onboarding to access'
                                      : subItem.label
                                  }
                                >
                                  <ListItem
                                    className={`list-item sub-item ${
                                      activeItem ===
                                      `${item.label}/${subItem.label}`
                                        ? 'active'
                                        : ''
                                    }`}
                                    component={Link}
                                    to={subItem.path}
                                    onClick={() => {
                                      if (!isDisabled) {
                                        handleListItemClick(
                                          subItem.label,
                                          item.label
                                        );
                                      }
                                    }}
                                  >
                                    <ListItemIcon className='list-item-icon'>
                                      {subItem.icon}
                                    </ListItemIcon>
                                    {isExpanded && (
                                      <ListItemText
                                        primary={subItem.label}
                                        className='list-item-text'
                                      />
                                    )}
                                  </ListItem>
                                </Tooltip>
                              ))}
                            </List>
                          </Collapse>
                        )}
                      </React.Fragment>
                    );
                  }
                } else if (
                  user?.userClubRole?.some(
                    (role) => role.roleName === 'MasterAdmin'
                  )
                ) {
                  if (
                    item.label !== 'Requests' &&
                    item.label !== 'Clubs' &&
                    item.label !== 'Assets' &&
                    item.label !== 'Courts' &&
                    item.label !== 'Settings' &&
                    item.label !== 'Schedules' &&
                    item.label !== 'Themes'
                  ) {
                    return;
                  }
                } else if (
                  user?.userClubRole?.some(
                    (role) => role.roleName === 'ClubAdmin'
                  )
                ) {
                  if (
                    item.label !== 'Assets' &&
                    item.label !== 'Settings' &&
                    item.label !== 'Members' &&
                    item.label !== 'Courts' &&
                    item.label !== 'Membership Plans' &&
                    item.label !== 'Club Bookings' &&
                    item.label !== 'Open Play' &&
                    item.label !== 'Coach' &&
                    item.label !== 'Themes' &&
                    item.label !== 'Profile'
                  ) {
                    return;
                  }
                } else if (
                  user?.userClubRole?.some((role) => role.roleName === 'Member')
                ) {
                  if (
                    item.label !== 'Bookings' &&
                    item.label !== 'Waitlist' &&
                    item.label !== 'Join Open Play' &&
                    item.label !== 'Coach Bookings' &&
                    item.label !== 'Profile' &&
                    item.label !== 'Themes'
                  ) {
                    return;
                  }
                }
                return (
                  <Tooltip
                    key={item.label}
                    disableHoverListener={isExpanded && !isDisabled}
                    placement='right'
                    title={
                      isDisabled ? 'Complete onboarding to access' : item.label
                    }
                  >
                    <ListItem
                      className={`list-item ${
                        activeItem === item.label ? 'active' : ''
                      } ${isDisabled ? 'disabled' : ''}`}
                      component={!isDisabled ? Link : 'div'}
                      to={!isDisabled ? item.path : ''}
                      onClick={
                        !isDisabled
                          ? () => handleListItemClick(item.label)
                          : undefined
                      }
                      aria-disabled={isDisabled}
                    >
                      <ListItemIcon className='list-item-icon'>
                        {item.iconPath ? (
                          <img src={item.iconPath} alt={item.label} />
                        ) : (
                          item.icon
                        )}
                      </ListItemIcon>
                      {isExpanded && (
                        <ListItemText
                          primary={item.label}
                          className='list-item-text'
                        />
                      )}
                    </ListItem>
                  </Tooltip>
                );
              })}
            </List>
          </div>
          <div className='sidebar-list-container'></div>

          <IconButton
            onClick={toggleSidenav}
            className={`toggle-button ${
              !isExpanded && isHovered ? 'show' : ''
            }`}
          >
            {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
      </Drawer>
      <div className='sidebar--main-content'>
        <Toolbar
          handleMenu={handleMenu}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <div className='sidebar--outlet-content'>
          <Outlet />
        </div>
        <div
          className={`mobile-sidebar-container ${
            isMobileMenuOpen
              ? 'mobile__sidebar-container_open'
              : 'mobile__sidebar-container_close'
          }`}
        >
          <div className='mobile-sidebar-header-wrapper'>
            <div className='mobile_sidebar_logo_container'>
              <img
                src='/src/assets/logo/full-logo.svg'
                alt='logo'
                className='mobile_sidebar_logo'
              />
            </div>
            <CloseIcon className='close_icon' onClick={closeMobileNav} />
          </div>
          <SideBarList
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
