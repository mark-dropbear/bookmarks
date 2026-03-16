import { expect } from '@esm-bundle/chai';
import { BrowserThemeRepository } from './BrowserThemeRepository.js';

describe('BrowserThemeRepository', () => {
  let repository;

  beforeEach(() => {
    localStorage.clear();
    repository = new BrowserThemeRepository();
  });

  it('should return auto by default', () => {
    expect(repository.getTheme()).to.equal('auto');
  });

  it('should save and retrieve theme from localStorage', () => {
    repository.setTheme('dark');
    expect(repository.getTheme()).to.equal('dark');
    expect(localStorage.getItem('theme-preference')).to.equal('dark');
  });

  it('should remove item from localStorage when set to auto', () => {
    repository.setTheme('dark');
    repository.setTheme('auto');
    expect(repository.getTheme()).to.equal('auto');
    expect(localStorage.getItem('theme-preference')).to.be.null;
  });
});
