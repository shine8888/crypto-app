import React, { useState, useEffect } from 'react';
import { Button, Menu, Typography, Avatar, Modal } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import {
  HomeOutlined,
  MoneyCollectOutlined,
  BulbOutlined,
  FundOutlined,
  MenuOutlined,
  DollarOutlined,
  TrademarkCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import icon from '../..//images/aave-logo-icon-ghost.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/auth.slice';

const Navbar = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  // USESTATE
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(null);
  const [visible, setVisible] = useState(false);

  // USESELECTOR
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // USEEFFECT
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize < 800) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const onLogout = () => {
    dispatch(logout());
    history.push('/');
  };

  return (
    <div className="nav-container">
      <div className="logo-container">
        <Avatar src={icon} size="large" />
        <Typography.Title level={2} className="logo">
          <Link to="/" style={{ color: '#fff' }}>
            Crypto News
          </Link>
        </Typography.Title>
        <Button
          className="menu-control-container"
          onClick={() => setActiveMenu(!activeMenu)}
        >
          <MenuOutlined />
        </Button>
      </div>

      {activeMenu && (
        <Menu theme="dark" style={{ backgroundColor: '#2ebac6' }}>
          <Menu.Item icon={<HomeOutlined />}>
            <Link to="/" style={{ color: '#fff' }}>
              Home
            </Link>
          </Menu.Item>
          <Menu.Item icon={<FundOutlined />}>
            <Link to="/cryptocurrencies" style={{ color: '#fff' }}>
              Cryptocurrencies
            </Link>
          </Menu.Item>
          <Menu.Item icon={<MoneyCollectOutlined />}>
            <Link to="/exchanges" style={{ color: '#fff' }}>
              Exchanges
            </Link>
          </Menu.Item>
          <Menu.Item icon={<BulbOutlined />}>
            <Link to="/news" style={{ color: '#fff' }}>
              News
            </Link>
          </Menu.Item>
          {isLoggedIn ? (
            <>
              <Menu.Item icon={<TrademarkCircleOutlined />}>
                <Link to="/trading" style={{ color: '#fff' }}>
                  Trading
                </Link>
              </Menu.Item>
              <Menu.Item icon={<DollarOutlined />}>
                <Link to="/investment" style={{ color: '#fff' }}>
                  Your Investment
                </Link>
              </Menu.Item>
              <Menu.Item
                icon={<UserOutlined />}
                onClick={() => setVisible(!visible)}
                style={{ color: '#FFF', hover: 'color: #1890ff' }}
              >
                Logout
                <Modal
                  title="Logout"
                  visible={visible}
                  onOk={() => {
                    onLogout();
                    setVisible(!visible);
                  }}
                  onCancel={() => setVisible(!visible)}
                >
                  <h3>Do you want to logout ?</h3>
                </Modal>
              </Menu.Item>
            </>
          ) : (
            <Menu.Item icon={<UserOutlined />}>
              <Link to="/login" style={{ color: '#fff' }}>
                Login
              </Link>
            </Menu.Item>
          )}
        </Menu>
      )}
    </div>
  );
};

export default Navbar;
