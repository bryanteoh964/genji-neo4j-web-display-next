'use client'
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import FormatContent from '../../components/FormatText.prod';
import styles from '../../styles/pages/blogTemplate.module.css';
import DiscussionArea from '../../components/DiscussionArea.prod';

const BlogPage = () => {
  const [blogNames, setBlogNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [defaultBlogContent, setDefaultBlogContent] = useState('');
  const [selectedBlog, setSelectedBlog] = useState('');
  const [authorInfo, setAuthorInfo] = useState({name: '', homepage: '', email: ''});
  const [expandedPanels, setExpandedPanels] = useState({
    blogs: false,
    discussion: false,
    other: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  
  const togglePanel = (panelName) => {
      setExpandedPanels(prev => ({
          ...prev,
          [panelName]: !prev[panelName]
      }));
  };

  useEffect(() => {
    const fetchContentAndAuthor = async () => {
      setIsLoading(true);
      if (selectedBlog) {
        try {
          // get blog content
          const blogRes = await fetch(`/api/blog/getSingle?title=${selectedBlog}`);
          const blogData = await blogRes.json();
          setContent(blogData.content);
          
          // get author info
          if (blogData.isUser === 'true' && blogData.authorEmail) {
            const apiUrl = `/api/user/getByEmail?email=${encodeURIComponent(blogData.authorEmail)}`;
            const authorRes = await fetch(apiUrl);
            const authorData = await authorRes.json();
            setAuthorInfo({
              name: authorData.name,
              homepage: `/userhomepage/${authorData._id}`,
              email: blogData.authorEmail
            });
          }
        } catch (error) {
          console.error('Error fetching blog content or author info:', error);
        }
      } else {
        // clear author info when no blog is selected
        setAuthorInfo({name: '', homepage: '', email: ''});
      }
      setIsLoading(false);
    };

    fetchContentAndAuthor();
  }, [selectedBlog]);

  useEffect(() => {
    const fetchBlogNames = async () => {
      const response = await fetch('/api/blog/getBlogList');
      const data = await response.json();
      const filteredTitles = data.titles.filter(title => 
        !['Collaborate', 'Team Members', 'Genjipoems Blog', 'Sources', 'Privacy Policy', 'Terms of Service',
          'About Arthur Waley', 'About Dennis Washburn', 'About Edward Seidensticker', 'About Edwin Cranston', 'About Royall Tyler',
          'About This Site', 'Further Reading'
        ].includes(title)
      );
      setBlogNames(filteredTitles);
    };
    fetchBlogNames();
  }, []);

  useEffect(() => {
    const fetchDefaultBlogContent = async () => {
      const response = await fetch(`/api/blog/getSingle?title=Genjipoems Blog`);
      const data = await response.json();
      setDefaultBlogContent(data.content);
    };
    fetchDefaultBlogContent();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBlogNames = blogNames.filter(blogName =>
    blogName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.translatorPage}>
        <div className={styles.heroSection}>
            <img
                className={styles.fullBackgroundImage}
                src={`/images/blog_banner.png`}
                alt="blog banner"
            />
            <div className={styles.blogTitleOverlay}>
                <span className={styles.blogTitle}>{selectedBlog}</span>
            </div>
        </div>

        <div className={styles.mainSection}>
        <div className={styles.analysisContainer}>
                      {/* Left Side - Panels with Toggles */}
                      <div className={styles.analysisLeft}>
                          
                          {/* Blogs Panel */}
                          <div className={styles.analysisPanel}>
                              <div className={styles.panelHeader}>
                                  <input
                                      ref={searchInputRef}
                                      type="text"
                                      className={styles.panelHeaderSearch}
                                      placeholder="Blogs"
                                      value={searchTerm}
                                      onChange={handleSearchChange}
                                  />
                                  <div 
                                      className={`${styles.toggleArrow} ${expandedPanels.blogs ? styles.arrowExpanded : styles.arrowCollapsed}`}
                                      onClick={() => togglePanel('blogs')}
                                  >
                                      ▼
                                  </div>
                              </div>
                              <div className={`${styles.panelContent} ${expandedPanels.blogs ? styles.expanded : styles.collapsed}`}>
                                  {filteredBlogNames.map((blogName, index) => (
                                      <div 
                                          key={index} 
                                          className={`${styles.blogItem} ${selectedBlog === blogName ? styles.selected : ''}`}
                                          onClick={() => setSelectedBlog(prev => prev === blogName ? '' : blogName)}
                                          style={{ cursor: 'pointer' }}
                                      >
                                          <span className={styles.blogLink}>
                                              {blogName}
                                          </span>
                                      </div>
                                  ))}
                                  {filteredBlogNames.length === 0 && searchTerm && (
                                      <div className={styles.noResults}>
                                          No blogs found
                                      </div>
                                  )}
                              </div>
                          </div>

                          {/* Discusssion Panel */}
                          <div className={styles.analysisPanel}>
                              <div className={styles.panelHeader} onClick={() => togglePanel('discusssion')}>
                                  <h2>DISCUSSION</h2>
                                  <div className={`${styles.toggleArrow} ${expandedPanels.discusssion ? styles.arrowExpanded : styles.arrowCollapsed}`}>
                                      ▼
                                  </div>
                              </div>
                              <div className={`${styles.panelContent} ${expandedPanels.discusssion ? styles.expanded : styles.collapsed}`}>
                                  <DiscussionArea 
                                      pageType="blog"
                                      identifier={`${selectedBlog}`}
                                  />
                              </div>
                          </div>

                          {/* Other Panel */}
                          <div className={styles.analysisPanel}>
                              <div className={styles.panelHeader} onClick={() => togglePanel('other')}>
                                  <h2>OTHER</h2>
                                  <div className={`${styles.toggleArrow} ${expandedPanels.other ? styles.arrowExpanded : styles.arrowCollapsed}`}>
                                      ▼
                                  </div>
                              </div>


                          </div>
                      </div>
                  </div>

          <div className={styles.description}>
              <div className={styles.descriptionContent}>
                  {isLoading ? (
                      <div className={styles.loading}>Loading...</div>
                  ) : (
                      <>  
                          <div className={styles.heading}>{selectedBlog}</div>
                          <FormatContent 
                              content={selectedBlog ? content : defaultBlogContent} 
                              className={styles.descriptionText} 
                          />
                          <a href={authorInfo.homepage} className={styles.author}>{authorInfo.name}</a>
                      </>
                  )}
              </div>
          </div>
      </div>
  </div>
)
}

export default BlogPage;
